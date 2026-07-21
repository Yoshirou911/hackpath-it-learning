import { getState, getQuizStats, getOverallProgress, getTopicProgress } from '../store.js'
import { roadmapTopics } from '../data/topics.js'
import { questions } from '../data/questions.js'

export function renderDashboard() {
  const state = getState()
  const quiz = getQuizStats()
  const overall = getOverallProgress()

  const topicCards = roadmapTopics
    .filter((t) => t.status !== 'locked')
    .map((topic) => {
      const progress = getTopicProgress(topic.id, topic.lessons)
      return `
        <a href="#${topic.path}" class="glass-card topic-card" data-nav="${topic.path}">
          <span class="topic-icon">${topic.icon}</span>
          <div class="topic-info">
            <h3>${topic.title}</h3>
            <p>${topic.subtitle}</p>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress.pct}%; background: ${topic.color}"></div>
            </div>
            <span class="progress-label">${progress.completed}/${progress.total} レッスン</span>
          </div>
        </a>
      `
    }).join('')

  return `
    <div class="page-header">
      <h1>ダッシュボード</h1>
      <p class="page-subtitle">学習の進捗を確認し、次のステップへ進もう</p>
    </div>

    <div class="stats-grid">
      <div class="glass-card stat-card">
        <span class="stat-icon">⭐</span>
        <div>
          <span class="stat-value">Lv.${state.level}</span>
          <span class="stat-label">${state.xp} XP</span>
        </div>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-icon">🧠</span>
        <div>
          <span class="stat-value">${quiz.answered}/${questions.length}</span>
          <span class="stat-label">問題回答</span>
        </div>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-icon">🎯</span>
        <div>
          <span class="stat-value">${quiz.accuracy}%</span>
          <span class="stat-label">正答率</span>
        </div>
      </div>
      <div class="glass-card stat-card">
        <span class="stat-icon">📈</span>
        <div>
          <span class="stat-value">${overall}%</span>
          <span class="stat-label">全体進捗</span>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="section-header">
        <h2>クイックスタート</h2>
      </div>
      <div class="quick-actions">
        <a href="#/roadmap" class="btn btn-primary" data-nav="/roadmap">🗺️ ロードマップを見る</a>
        <a href="#/quiz" class="btn btn-secondary" data-nav="/quiz">🧠 問題演習を始める</a>
        <a href="#/study/itp" class="btn btn-ghost" data-nav="/study/itp">📘 ITパスポートから学ぶ</a>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>学習モジュール</h2>
      </div>
      <div class="topic-grid">
        ${topicCards}
      </div>
    </section>
  `
}
