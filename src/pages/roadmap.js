import { roadmapTopics } from '../data/topics.js'
import { getTopicProgress } from '../store.js'
import { getCourseRank, learningRanks } from '../data/ranks.js'
import { renderRankBadge } from '../components/rank.js'

export function renderRoadmap() {
  const certifications = roadmapTopics.filter((topic) => topic.category === 'certification')
  const skills = roadmapTopics.filter((topic) => topic.category === 'skill')

  return `
    <div class="page-header roadmap-rank-header">
      <span class="eyebrow">RANK PROTOCOL</span>
      <h1>3つのランクで、<br><span>知識を実力に変える。</span></h1>
      <p class="page-subtitle">すべてのコースは基礎・応用・上級の順に解放されます。</p>
    </div>

    <div class="rank-protocol-grid">
      ${learningRanks.map((rank, index) => `
        <article class="rank-protocol-card rank-surface-${rank.id}">
          <span class="rank-protocol-number">0${index + 1}</span>
          ${renderRankBadge(rank)}
          <h2>${rank.stage}</h2>
          <p>${rank.tagline}</p>
          <span class="rank-protocol-line"></span>
          <small>${index === 0 ? 'START HERE' : index === 1 ? 'BRONZE CLEAR' : 'SILVER CLEAR'}</small>
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
  const progress = getTopicProgress(topic.id, topic.lessons)
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
        <div><div class="progress-bar"><div class="progress-fill" style="width: ${progress.pct}%; background: ${rank.color}"></div></div><small>${progress.completed}/${progress.total} COMPLETE</small></div>
        ${locked ? '<span class="rank-lock-symbol">⌁</span>' : `<a href="#${topic.path}" class="rank-arrow-link" data-nav="${topic.path}" aria-label="${topic.title}を開く">↗</a>`}
      </div>
    </article>
  `
}
