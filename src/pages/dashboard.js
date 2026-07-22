import { getState, getQuizStats, getOverallProgress, getTopicProgress } from '../store.js'
import { roadmapTopics } from '../data/topics.js'
import { questions } from '../data/questions.js'
import { getAccountRank, getCourseRank, learningRanks } from '../data/ranks.js'
import { renderRankBadge, renderRankEmblem } from '../components/rank.js'

export function renderDashboard() {
  const state = getState()
  const quiz = getQuizStats()
  const accountRank = getAccountRank(state.xp)

  const topicCards = roadmapTopics
    .filter((topic) => topic.status !== 'locked')
    .map((topic) => {
      const progress = getTopicProgress(topic.id, topic.lessons)
      const rank = getCourseRank(progress.completed, progress.total)
      return `
        <a href="#${topic.path}" class="glass-card topic-card ranked-topic-card rank-surface-${rank.id}" data-nav="${topic.path}">
          <div class="topic-card-topline">
            <span class="topic-icon">${topic.icon}</span>
            ${renderRankBadge(rank, { compact: true, completed: progress.pct === 100 })}
          </div>
          <div class="topic-info">
            <h3>${topic.title}</h3>
            <p>${topic.subtitle}</p>
            <div class="progress-bar rank-progress">
              <div class="progress-fill" style="width: ${progress.pct}%; background: ${rank.color}"></div>
            </div>
            <span class="progress-label">${progress.completed}/${progress.total} レッスン · ${rank.stage}</span>
          </div>
        </a>
      `
    }).join('')

  const overall = getOverallProgress()

  return `
    <div class="page-header command-header">
      <span class="eyebrow">HACKPATH // COMMAND CENTER</span>
      <h1>学習ランクを<br><span>駆け上がれ。</span></h1>
      <p class="page-subtitle">基礎から応用、そして上級へ。知識と実績でランクを解放しよう。</p>
    </div>

    <section class="rank-command-card rank-surface-${accountRank.current.id}">
      <div class="rank-command-emblem">${renderRankEmblem(accountRank.current)}</div>
      <div class="rank-command-copy">
        <span class="eyebrow">CURRENT OPERATOR RANK</span>
        <h2>${accountRank.current.label} <small>${accountRank.current.stage}</small></h2>
        <p>${accountRank.current.tagline}。レッスンとクイズを攻略して次のランクへ。</p>
        <div class="rank-xp-row"><strong>${state.xp} XP</strong><span>${accountRank.next ? `次の${accountRank.next.label}まで ${accountRank.remainingXP} XP` : '最高ランク到達'}</span></div>
        <div class="rank-meter"><span style="width: ${accountRank.progress}%"></span></div>
      </div>
      <div class="rank-command-number">0${learningRanks.indexOf(accountRank.current) + 1}</div>
    </section>

    <div class="rank-ladder" aria-label="学習ランク一覧">
      ${learningRanks.map((rank, index) => `
        <div class="rank-ladder-step rank-${rank.id} ${index <= learningRanks.indexOf(accountRank.current) ? 'is-active' : ''}">
          <span class="rank-step-index">0${index + 1}</span>
          <span class="rank-gem" aria-hidden="true"></span>
          <div><strong>${rank.name}</strong><small>${rank.stage} · ${rank.tagline}</small></div>
        </div>
      `).join('')}
    </div>

    <div class="stats-grid rank-stats-grid">
      <div class="glass-card stat-card"><span class="stat-icon">⚡</span><div><span class="stat-value">Lv.${state.level}</span><span class="stat-label">オペレーターレベル</span></div></div>
      <div class="glass-card stat-card"><span class="stat-icon">◈</span><div><span class="stat-value">${quiz.answered}/${questions.length}</span><span class="stat-label">問題回答</span></div></div>
      <div class="glass-card stat-card"><span class="stat-icon">◎</span><div><span class="stat-value">${quiz.accuracy}%</span><span class="stat-label">正答率</span></div></div>
      <div class="glass-card stat-card"><span class="stat-icon">▰</span><div><span class="stat-value">${overall}%</span><span class="stat-label">全体進捗</span></div></div>
    </div>

    <section class="section">
      <div class="section-header rank-section-header">
        <div><span class="eyebrow">MISSION SELECT</span><h2>学習コース</h2></div>
        <a href="#/roadmap" class="btn btn-secondary" data-nav="/roadmap">全ランクを見る →</a>
      </div>
      <div class="topic-grid">${topicCards}</div>
    </section>
  `
}
