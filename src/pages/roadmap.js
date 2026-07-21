import { roadmapTopics } from '../data/topics.js'
import { getTopicProgress } from '../store.js'

export function renderRoadmap() {
  const topicItems = roadmapTopics.map((topic) => {
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
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress.pct}%; background: ${topic.color}"></div>
              </div>
              <span class="progress-label">${progress.completed}/${progress.total} レッスン完了</span>
              ${topic.status === 'locked' 
                ? '<p style="color: var(--text); opacity: 0.5; margin-top: 8px; font-size: 14px;">🔒 準備中</p>'
                : `<a href="#${topic.path}" class="btn btn-primary" style="margin-top: 12px; font-size: 13px;" data-nav="${topic.path}">学習を始める</a>`
              }
            </div>
          </div>
        </div>
      </div>
    `
  }).join('')

  return `
    <div class="page-header">
      <h1>学習ロードマップ</h1>
      <p class="page-subtitle">ITエンジニアへの道のりを段階的に学習しよう</p>
    </div>

    <div class="roadmap-container">
      <div class="roadmap-timeline">
        ${topicItems}
      </div>
    </div>
  `
}
