import { roadmapTopics } from '../data/topics.js'
import { getTopicQuizProgress } from '../store.js'
import { getCourseRank, learningRanks } from '../data/ranks.js'
import { renderRankBadge } from '../components/rank.js'

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

    ${renderGroup('実務スキル', '現場で使う技術をランク別に攻略', skills)}
    ${renderGroup('IT資格', '試験範囲を基礎から上級へ積み上げる', certifications)}
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
