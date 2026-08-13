import { roadmapTopics } from '../data/topics.js'
import { getTopicQuizProgress } from '../store.js'
import { accountRanks, getCourseRank, learningRanks } from '../data/ranks.js'
import { certificationPyramidTiers } from '../data/certificationPyramid.js'
import { certificationDifficultyRanking, certificationDifficultyRubric, certificationDifficultySources } from '../data/certificationDifficulty.js'
import { renderRankBadge, renderRankSigil } from '../components/rank.js'

export function renderRoadmap() {
  const certifications = roadmapTopics.filter((topic) => topic.category === 'certification')
  const skills = roadmapTopics.filter((topic) => topic.category === 'skill')

  return `
    <div class="page-header roadmap-rank-header">
      <span class="eyebrow">RANK PROTOCOL</span>
      <h1>3つのランクで、<br><span>知識を実力に変える。</span></h1>
      <p class="page-subtitle">基礎・応用・上級のすべてを自由に閲覧できます。問題に回答してXPを獲得しよう。</p>
    </div>

    <figure class="foundation-map-card">
      <img src="/foundations-map.png" alt="Web、Linuxサーバー、ネットワーク、データベースが連携するITシステムの全体図">
      <figcaption>
        <span class="eyebrow">FOUNDATION SYSTEM MAP</span>
        <h2>4つの基盤は、1つのシステムとしてつながる。</h2>
        <p>Webの要求はネットワークを通り、Linux上の処理がデータベースを読み書きします。各教材では仕組み・実践・障害対応をつなげて学びます。</p>
      </figcaption>
    </figure>

    <div class="rank-protocol-grid">
      ${learningRanks.map((rank, index) => `
        <article class="rank-protocol-card rank-surface-${rank.id}">
          <span class="rank-protocol-number">0${index + 1}</span>
          ${renderRankBadge(rank)}
          <h2>${rank.stage}</h2>
          <p>${rank.tagline}</p>
          <span class="rank-protocol-line"></span>
          <small>いつでも閲覧可能</small>
        </article>
      `).join('')}
    </div>

    ${renderCertificationPyramid(certifications)}
    ${renderCertificationDifficultyRanking(certifications)}
    ${renderGroup('実務スキル', '現場で使う技術をランク別に攻略', skills)}
    ${renderGroup('IT資格', '試験範囲を基礎から上級へ積み上げる', certifications)}
  `
}

function renderCertificationDifficultyRanking(certifications) {
  const topicMap = new Map(certifications.map((topic) => [topic.id, topic]))
  const ranking = certificationDifficultyRanking
    .map((entry, index) => ({ ...entry, position: index + 1, topic: topicMap.get(entry.topicId) }))
    .filter((entry) => entry.topic)
  const podium = ranking.slice(0, 3)

  return `
    <section class="section certification-difficulty-section" aria-labelledby="certification-difficulty-title">
      <div class="section-header rank-section-header certification-difficulty-header">
        <div>
          <span class="eyebrow">CERTIFICATION DIFFICULTY INDEX</span>
          <h2 id="certification-difficulty-title">資格難易度ランキング</h2>
          <p class="progress-label">学習順とは別に、試験で要求される知識・判断・解答負荷を100点で比較しています。</p>
        </div>
        <span class="difficulty-edition">2026.08<br><b>HACKPATH ESTIMATE</b></span>
      </div>

      <div class="difficulty-method-card">
        <div>
          <strong>採点ルーブリック</strong>
          <p>公式区分を基礎資料として、5項目を共通採点。合格率や学習時間は受験者・年度で変わるため含めていません。</p>
        </div>
        <div class="difficulty-rubric-grid">
          ${certificationDifficultyRubric.map((item) => `<span><b>${item.max}</b><small>${item.label}</small></span>`).join('')}
        </div>
      </div>

      <div class="difficulty-podium">
        ${podium.map((entry) => renderDifficultyPodium(entry)).join('')}
      </div>

      <div class="difficulty-ranking-list">
        ${ranking.map((entry) => renderDifficultyRow(entry)).join('')}
      </div>

      <div class="difficulty-ranking-footer">
        <p>※ HackPath独自推定です。同じS帯の高度資格は専門分野が異なり、点差がそのまま優劣を意味するものではありません。「セキュリティ＆倫理的ハッキング」は単一の資格ではないため対象外です。</p>
        <div>${certificationDifficultySources.map((source) => `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label} ↗</a>`).join('')}</div>
      </div>
    </section>
  `
}

function renderDifficultyPodium(entry) {
  return `
    <a class="difficulty-podium-card difficulty-place-${entry.position} difficulty-tier-${entry.tier.toLowerCase()}" href="#${entry.topic.path}" data-nav="${entry.topic.path}">
      <span class="difficulty-place">#${String(entry.position).padStart(2, '0')}</span>
      <span class="difficulty-topic-icon" aria-hidden="true">${entry.topic.icon}</span>
      <strong>${entry.topic.title}</strong>
      <small>${entry.officialBand}</small>
      <b>${entry.score}<i>/100</i></b>
    </a>
  `
}

function renderDifficultyRow(entry) {
  return `
    <article class="difficulty-ranking-row difficulty-tier-${entry.tier.toLowerCase()}">
      <span class="difficulty-rank-number">${String(entry.position).padStart(2, '0')}</span>
      <span class="difficulty-tier-label">${entry.tier}</span>
      <div class="difficulty-course-copy">
        <a href="#${entry.topic.path}" data-nav="${entry.topic.path}">${entry.topic.icon} <strong>${entry.topic.title}</strong></a>
        <small>${entry.officialBand}</small>
        <p>${entry.reason}</p>
      </div>
      <div class="difficulty-breakdown" aria-label="${entry.topic.title}の採点内訳">
        ${certificationDifficultyRubric.map((item) => `<span title="${item.label} ${entry.breakdown[item.id]}/${item.max}"><i style="--meter:${(entry.breakdown[item.id] / item.max) * 100}%"></i><small>${item.label}</small></span>`).join('')}
      </div>
      <div class="difficulty-score"><strong>${entry.score}</strong><small>/100</small></div>
    </article>
  `
}

function renderCertificationPyramid(certifications) {
  const topicMap = new Map(certifications.map((topic) => [topic.id, topic]))
  const rankMap = new Map(accountRanks.map((rank) => [rank.id, rank]))

  return `
    <section class="section certification-pyramid-section" aria-labelledby="certification-pyramid-title">
      <div class="section-header rank-section-header certification-pyramid-header">
        <div>
          <span class="eyebrow">CERTIFICATION ECOSYSTEM</span>
          <h2 id="certification-pyramid-title">資格スキルピラミッド</h2>
          <p class="progress-label">土台の共通知識から、頂点の高度専門領域へ。資格同士のつながりを一枚で確認できます。</p>
        </div>
        <div class="pyramid-direction" aria-hidden="true"><span>APEX</span><i></i><span>FOUNDATION</span></div>
      </div>

      <div class="certification-pyramid-shell">
        <div class="certification-pyramid">
          ${certificationPyramidTiers.map((tier, index) => {
            const rank = rankMap.get(tier.rankId)
            const topics = tier.topicIds.map((id) => topicMap.get(id)).filter(Boolean)
            const width = 40 + (index * 10)
            const mobileInset = Math.max(0, 42 - (index * 7))

            return `
              <article class="certification-tier rank-surface-${rank.id}" style="--tier-width:${width}%;--tier-mobile-inset:${mobileInset}px">
                <div class="certification-tier-rank">
                  ${renderRankSigil(rank, 'certification-tier-sigil')}
                  <span><strong>${rank.name}</strong><small>${tier.label}</small></span>
                </div>
                <div class="certification-tier-body">
                  <p>${tier.description}</p>
                  <div class="certification-tier-courses">
                    ${topics.map((topic) => renderPyramidCourse(topic)).join('')}
                  </div>
                </div>
              </article>
            `
          }).join('')}
        </div>
      </div>
      <p class="certification-pyramid-note">※ この配置はHackPath独自の学習目安です。公式な資格の序列や合格難易度を表すものではありません。どのランクからでも自由に学習・挑戦できます。</p>
    </section>
  `
}

function renderPyramidCourse(topic) {
  const progress = getTopicQuizProgress(topic.id)
  return `
    <a class="certification-pyramid-course" href="#${topic.path}" data-nav="${topic.path}" aria-label="${topic.title}を開く。現在の正解進捗${progress.pct}%">
      <span aria-hidden="true">${topic.icon}</span>
      <strong>${topic.title}</strong>
      <small>${progress.pct}%</small>
    </a>
  `
}

function renderGroup(title, description, topics) {
  return `
    <section class="section course-group ranked-course-group">
      <div class="section-header rank-section-header">
        <div><span class="eyebrow">COURSE DIVISION</span><h2>${title}</h2><p class="progress-label">${description}</p></div>
      </div>
      <div class="ranked-roadmap-grid">${topics.map(renderTopic).join('')}</div>
    </section>
  `
}

function renderTopic(topic) {
  const progress = getTopicQuizProgress(topic.id)
  const rank = getCourseRank(progress.completed, progress.total)
  const locked = topic.status === 'locked'

  return `
    <article class="glass-card ranked-roadmap-card rank-surface-${rank.id} ${locked ? 'is-locked' : ''}">
      <div class="ranked-roadmap-top">
        <span class="topic-icon">${topic.icon}</span>
        ${locked ? '<span class="rank-lock-label">COMING SOON</span>' : renderRankBadge(rank, { compact: true, completed: progress.pct === 100 })}
      </div>
      <span class="eyebrow">${topic.category === 'skill' ? 'SKILL COURSE' : 'CERTIFICATION'}</span>
      <h3>${topic.title}</h3>
      <p>${topic.description}</p>
      <div class="rank-card-footer">
        <div><div class="progress-bar"><div class="progress-fill" style="width: ${progress.pct}%; background: ${rank.color}"></div></div><small>${progress.completed}/${progress.total} 問正解</small></div>
        ${locked ? '<span class="rank-lock-symbol">⌁</span>' : `<a href="#${topic.path}" class="rank-arrow-link" data-nav="${topic.path}" aria-label="${topic.title}を開く">↗</a>`}
      </div>
    </article>
  `
}
