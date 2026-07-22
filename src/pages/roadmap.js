import { roadmapTopics } from '../data/topics.js'
import { getTopicProgress } from '../store.js'

export function renderRoadmap() {
  const certifications = roadmapTopics.filter((topic) => topic.category === 'certification')
  const skills = roadmapTopics.filter((topic) => topic.category === 'skill')

  return `
    <div class="page-header">
      <h1>学習ロードマップ</h1>
      <p class="page-subtitle">資格対策と実務スキルから、目的に合うコースを選ぼう</p>
    </div>

    ${renderGroup('🛠️ 実務スキルコース', '手を動かすために必要な分野別知識', skills)}
    ${renderGroup('🏅 IT資格コース', '試験範囲に沿って体系的に学ぶ', certifications)}
  `
}

function renderGroup(title, description, topics) {
  return `
    <section class="section course-group">
      <div class="section-header">
        <div><h2>${title}</h2><p class="progress-label">${description}</p></div>
      </div>
      <div class="roadmap-container">
        <div class="roadmap-timeline">${topics.map(renderTopic).join('')}</div>
      </div>
    </section>
  `
}

function renderTopic(topic) {
  const progress = getTopicProgress(topic.id, topic.lessons)
  const statusClass = topic.status === 'locked' ? 'locked' : (progress.pct === 100 ? 'completed' : '')

  return `
    <div class="roadmap-item ${statusClass}">
      <div class="glass-card">
        <div style="display: flex; align-items: flex-start; gap: 16px;">
          <span class="topic-icon" style="font-size: 48px;">${topic.icon}</span>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 4px;">${topic.title}</h3>
            <p style="color: var(--text); opacity: 0.7; margin-bottom: 12px;">${topic.subtitle}</p>
            <p style="font-size: 14px; margin-bottom: 12px;">${topic.description}</p>
            <div class="progress-bar"><div class="progress-fill" style="width: ${progress.pct}%; background: ${topic.color}"></div></div>
            <span class="progress-label">${progress.completed}/${progress.total} レッスン完了</span>
            ${topic.status === 'locked'
              ? '<p style="color: var(--text); opacity: 0.5; margin-top: 8px; font-size: 14px;">🔒 準備中</p>'
              : `<a href="#${topic.path}" class="btn btn-primary" style="margin-top: 12px; font-size: 13px;" data-nav="${topic.path}">学習を始める</a>`}
          </div>
        </div>
      </div>
    </div>
  `
}
