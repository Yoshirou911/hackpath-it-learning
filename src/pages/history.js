import { getHistory, getDailyStats } from '../store.js'
import { getTopicById } from '../data/topics.js'
import { renderDailyStatsChart, DAILY_RANGE_OPTIONS } from '../components/dailyStatsChart.js'

// 集計期間は画面内の表示設定のため、保存データへは含めない。
let selectedRange = 14

export function renderHistory() {
  const history = getHistory(50)

  return `
    <div class="page-header">
      <h1>学習履歴</h1>
      <p class="page-subtitle">あなたの学習活動を振り返る</p>
    </div>

    ${renderDailyStatsChart(getDailyStats(), selectedRange)}

    <div class="glass-card">
      ${history.length === 0 ? `
        <div style="text-align: center; padding: 48px;">
          <p style="font-size: 18px; margin-bottom: 16px;">まだ履歴がありません</p>
          <p style="color: var(--text); opacity: 0.7;">レッスンを完了したり、クイズに回答するとここに表示されます</p>
        </div>
      ` : `
        <div class="history-list">
          ${history.map(entry => renderHistoryEntry(entry)).join('')}
        </div>
      `}
    </div>
  `
}

function renderHistoryEntry(entry) {
  const date = new Date(entry.timestamp)
  const formattedDate = date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
  const formattedTime = date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })

  let icon = ''
  let title = ''
  let description = ''

  if (entry.type === 'lesson') {
    icon = '📚'
    const topic = getTopicById(entry.data.topicId)
    title = 'レッスン完了'
    description = `${topic?.title || entry.data.topicId} - レッスン ${entry.data.lessonId}`
  } else if (entry.type === 'quiz') {
    icon = entry.data.isCorrect ? '✅' : '❌'
    title = entry.data.isCorrect ? 'クイズ正解' : 'クイズ不正解'
    description = `問題 ID: ${entry.data.questionId}`
  }

  return `
    <div class="history-entry">
      <div class="history-icon">${icon}</div>
      <div class="history-content">
        <div class="history-header">
          <span class="history-title">${title}</span>
          <span class="history-time">${formattedDate} ${formattedTime}</span>
        </div>
        <p class="history-description">${description}</p>
      </div>
    </div>
  `
}

// 期間切替はグラフ部分だけを差し替え、履歴一覧のスクロール位置を保つ。
export function bindHistoryEvents(container) {
  const chart = container.querySelector('[data-daily-stats]')
  if (!chart) return
  chart.addEventListener('click', (event) => {
    const button = event.target.closest('[data-daily-range]')
    if (!button) return
    const days = Number(button.dataset.dailyRange)
    if (!DAILY_RANGE_OPTIONS.some((option) => option.days === days) || days === selectedRange) return
    selectedRange = days
    chart.outerHTML = renderDailyStatsChart(getDailyStats(), selectedRange)
    bindHistoryEvents(container)
  })
}
