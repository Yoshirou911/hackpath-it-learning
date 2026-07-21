import { getHistory } from '../store.js'

export function renderHistory() {
  const history = getHistory(50)

  return `
    <div class="page-header">
      <h1>学習履歴</h1>
      <p class="page-subtitle">あなたの学習活動を振り返る</p>
    </div>

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
    const topicNames = {
      itp: 'ITパスポート',
      fe: '基本情報',
      ap: '応用情報',
      sec: 'セキュリティ',
    }
    title = 'レッスン完了'
    description = `${topicNames[entry.data.topicId] || entry.data.topicId} - レッスン ${entry.data.lessonId}`
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

export function bindHistoryEvents(container) {
  // 履歴ページには特別なイベントバインディングは不要
}
