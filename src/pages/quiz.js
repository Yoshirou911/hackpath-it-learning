import { questions, getQuestionsByTopic } from '../data/questions.js'
import { recordQuizAnswer, getQuizStats, getState } from '../store.js'
import { roadmapTopics } from '../data/topics.js'
import { navigate } from '../router.js'

let currentQuestionIndex = 0
let currentQuestions = []
let selectedChoice = null
let answered = false
let currentMode = 'all'
let currentTopic = ''

// mode: 'all' | 'unanswered' | 'incorrect'
function filterQuestions(base, mode) {
  const state = getState()
  const answeredMap = state.quiz.answered || {}
  if (mode === 'unanswered') return base.filter(q => !(q.id in answeredMap))
  if (mode === 'incorrect') return base.filter(q => answeredMap[q.id] === false)
  return base
}

export function renderQuiz(path, params = []) {
  currentTopic = params[0] || ''
  const urlMode = params[1] || 'all'
  currentMode = urlMode

  const baseQuestions = currentTopic ? getQuestionsByTopic(currentTopic) : [...questions]
  currentQuestions = filterQuestions(baseQuestions, currentMode)
  currentQuestionIndex = 0
  selectedChoice = null
  answered = false

  const stats = getQuizStats()
  const state = getState()
  const answeredMap = state.quiz.answered || {}

  const totalAll = baseQuestions.length
  const totalUnanswered = baseQuestions.filter(q => !(q.id in answeredMap)).length
  const totalIncorrect = baseQuestions.filter(q => answeredMap[q.id] === false).length

  const topicOptions = [
    { value: '', label: 'すべての分野' },
    ...roadmapTopics
      .filter((topic) => getQuestionsByTopic(topic.id).length > 0)
      .map((topic) => ({ value: topic.id, label: topic.title })),
  ]

  const modeOptions = [
    { value: 'all',        label: `全問題 (${totalAll})`,        icon: '📋' },
    { value: 'unanswered', label: `未回答 (${totalUnanswered})`, icon: '❓' },
    { value: 'incorrect',  label: `不正解 (${totalIncorrect})`,  icon: '❌' },
  ]

  return `
    <div class="page-header">
      <h1>問題演習</h1>
      <p class="page-subtitle">知識を定着させよう</p>
    </div>

    <div class="glass-card" style="margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
        <div>
          <span style="font-size: 14px; color: var(--text); opacity: 0.7;">分野:</span>
          <select id="topic-filter" style="padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg); color: var(--text-h); margin-left: 8px;">
            ${topicOptions.map(opt => `
              <option value="${opt.value}" ${currentTopic === opt.value ? 'selected' : ''}>${opt.label}</option>
            `).join('')}
          </select>
        </div>
        <div style="margin-left: auto; font-size: 14px; color: var(--text); opacity: 0.7;">
          回答済み: ${stats.answered}/${questions.length} | 正答率: ${stats.accuracy}%
        </div>
      </div>

      <!-- 復習モードタブ -->
      <div style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;">
        ${modeOptions.map(m => `
          <button
            id="mode-btn-${m.value}"
            class="mode-tab-btn ${currentMode === m.value ? 'active' : ''}"
            data-mode="${m.value}"
            style="
              padding: 8px 16px;
              border-radius: 20px;
              border: 1px solid ${currentMode === m.value ? 'var(--accent)' : 'var(--border)'};
              background: ${currentMode === m.value ? 'var(--accent)' : 'transparent'};
              color: ${currentMode === m.value ? '#000' : 'var(--text)'};
              font-size: 13px;
              cursor: pointer;
              transition: all 0.2s;
              font-weight: ${currentMode === m.value ? '600' : '400'};
            "
          >${m.icon} ${m.label}</button>
        `).join('')}
      </div>
    </div>

    <div class="quiz-container">
      <div id="quiz-content">
        ${renderQuestionCard()}
      </div>
    </div>
  `
}

function renderQuestionCard() {
  if (currentQuestions.length === 0) {
    const emptyMessages = {
      unanswered: { emoji: '🎉', title: '未回答の問題はありません！', sub: 'すべての問題に回答しました。不正解の問題を復習しましょう。' },
      incorrect:  { emoji: '✨', title: '不正解の問題はありません！', sub: 'すべての問題を正解しています。素晴らしい！' },
      all:        { emoji: '📭', title: '問題がありません',            sub: '分野フィルターを確認してください。' },
    }
    const msg = emptyMessages[currentMode] || emptyMessages.all
    return `
      <div class="glass-card" style="text-align: center; padding: 48px;">
        <div style="font-size: 48px; margin-bottom: 16px;">${msg.emoji}</div>
        <p style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">${msg.title}</p>
        <p style="font-size: 14px; opacity: 0.7; margin-bottom: 24px;">${msg.sub}</p>
        <a href="#/roadmap" class="btn btn-secondary" data-nav="/roadmap">ロードマップに戻る</a>
      </div>
    `
  }

  if (currentQuestionIndex >= currentQuestions.length) {
    const stats = getQuizStats()
    const correct = currentQuestions.filter(q => {
      const state = getState()
      return state.quiz.answered[q.id] === true
    }).length
    return `
      <div class="glass-card" style="text-align: center; padding: 48px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
        <h2 style="margin-bottom: 8px;">クイズ完了！</h2>
        <p style="font-size: 18px; margin-bottom: 24px;">
          今回の正答率: <strong>${currentQuestions.length > 0 ? Math.round((correct / currentQuestions.length) * 100) : 0}%</strong>
          (${correct}/${currentQuestions.length}問正解)
        </p>
        <p style="font-size: 14px; opacity: 0.7; margin-bottom: 24px;">
          累計 — 回答済み: ${stats.answered}問 | 正答率: ${stats.accuracy}%
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" id="restart-quiz">もう一度挑戦</button>
          <button class="btn btn-secondary" id="switch-incorrect">不正解だけ復習</button>
          <a href="#/" class="btn btn-secondary" data-nav="/">ダッシュボードへ</a>
        </div>
      </div>
    `
  }

  const question = currentQuestions[currentQuestionIndex]
  const state = getState()
  const previousAnswer = state.quiz.answered[question.id]
  const hasPreviousAnswer = question.id in (state.quiz.answered || {})

  return `
    <div class="glass-card question-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
        <span style="font-size: 14px; color: var(--text); opacity: 0.7;">
          問題 ${currentQuestionIndex + 1} / ${currentQuestions.length}
        </span>
        <div style="display: flex; align-items: center; gap: 8px;">
          ${hasPreviousAnswer ? `
            <span style="font-size: 12px; padding: 3px 10px; border-radius: 12px; background: ${previousAnswer ? 'rgba(0,255,136,0.15)' : 'rgba(255,68,102,0.15)'}; color: ${previousAnswer ? '#00ff88' : '#ff4466'};">
              ${previousAnswer ? '✓ 前回正解' : '✗ 前回不正解'}
            </span>
          ` : ''}
          <span style="font-size: 12px; padding: 3px 10px; border-radius: 12px; background: rgba(108,71,255,0.15); color: var(--accent-2);">
            ${question.topic.toUpperCase()}
          </span>
        </div>
      </div>

      <!-- 進捗バー -->
      <div style="height: 4px; background: var(--border); border-radius: 2px; margin-bottom: 20px; overflow: hidden;">
        <div style="height: 100%; width: ${((currentQuestionIndex) / currentQuestions.length) * 100}%; background: var(--accent); border-radius: 2px; transition: width 0.3s;"></div>
      </div>
      
      <p class="question-text">${question.question}</p>
      
      <ul class="choices-list">
        ${question.choices.map((choice, index) => `
          <li class="choice-item ${selectedChoice === index ? 'selected' : ''} ${answered && index === question.answer ? 'correct' : ''} ${answered && selectedChoice === index && index !== question.answer ? 'incorrect' : ''}" 
              data-choice="${index}" 
              ${answered ? 'style="pointer-events: none;"' : ''}>
            <span style="margin-right: 12px; font-weight: 500;">${String.fromCharCode(65 + index)}.</span>
            ${choice}
          </li>
        `).join('')}
      </ul>

      <div class="explanation ${answered ? 'visible' : ''}">
        <strong>解説:</strong>
        <p style="margin-top: 8px;">${question.explanation}</p>
      </div>

      <div class="quiz-nav">
        <button class="btn btn-secondary" id="prev-question" ${currentQuestionIndex === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
          ← 前の問題
        </button>
        
        ${!answered ? `
          <button class="btn btn-primary" id="submit-answer" ${selectedChoice === null ? 'disabled style="opacity: 0.5;"' : ''}>
            回答する
          </button>
        ` : `
          <button class="btn btn-primary" id="next-question">
            ${currentQuestionIndex < currentQuestions.length - 1 ? '次の問題 →' : '結果を見る'}
          </button>
        `}
      </div>
    </div>
  `
}

export function bindQuizEvents(container) {
  // 分野フィルター
  const topicFilter = container.querySelector('#topic-filter')
  if (topicFilter && !topicFilter.dataset.eventsBound) {
    topicFilter.dataset.eventsBound = 'true'
    topicFilter.addEventListener('change', (e) => {
      currentTopic = e.target.value
      _reloadWithCurrentSettings()
    })
  }

  // モードタブ
  container.querySelectorAll('.mode-tab-btn').forEach(btn => {
    if (btn.dataset.eventsBound) return
    btn.dataset.eventsBound = 'true'
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode
      _reloadWithCurrentSettings()
    })
  })

  // 不正解だけ復習ボタン（完了画面）
  const switchIncorrectBtn = container.querySelector('#switch-incorrect')
  if (switchIncorrectBtn) {
    switchIncorrectBtn.addEventListener('click', () => {
      currentMode = 'incorrect'
      _reloadWithCurrentSettings()
    })
  }

  // リスタートボタン
  const restartBtn = container.querySelector('#restart-quiz')
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      const baseQuestions = currentTopic ? getQuestionsByTopic(currentTopic) : [...questions]
      currentQuestions = filterQuestions(baseQuestions, currentMode)
      currentQuestionIndex = 0
      selectedChoice = null
      answered = false
      container.querySelector('#quiz-content').innerHTML = renderQuestionCard()
      bindQuizEvents(container)
    })
  }

  // 選択肢クリック
  const choices = container.querySelectorAll('.choice-item')
  choices.forEach(choice => {
    choice.addEventListener('click', () => {
      if (answered) return
      selectedChoice = parseInt(choice.dataset.choice)
      choices.forEach(c => c.classList.remove('selected'))
      choice.classList.add('selected')
      
      const submitBtn = container.querySelector('#submit-answer')
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.style.opacity = '1'
      }
    })
  })

  // 回答ボタン
  const submitBtn = container.querySelector('#submit-answer')
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (selectedChoice === null || answered) return
      
      const question = currentQuestions[currentQuestionIndex]
      const isCorrect = selectedChoice === question.answer
      answered = true
      recordQuizAnswer(question.id, isCorrect)
      
      container.querySelector('#quiz-content').innerHTML = renderQuestionCard()
      bindQuizEvents(container)
    })
  }

  // 次の問題
  const nextBtn = container.querySelector('#next-question')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentQuestionIndex++
      selectedChoice = null
      answered = false
      container.querySelector('#quiz-content').innerHTML = renderQuestionCard()
      bindQuizEvents(container)
    })
  }

  // 前の問題
  const prevBtn = container.querySelector('#prev-question')
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--
        selectedChoice = null
        answered = false
        container.querySelector('#quiz-content').innerHTML = renderQuestionCard()
        bindQuizEvents(container)
      }
    })
  }
}

function _reloadWithCurrentSettings() {
  const baseQuestions = currentTopic ? getQuestionsByTopic(currentTopic) : [...questions]
  currentQuestions = filterQuestions(baseQuestions, currentMode)
  currentQuestionIndex = 0
  selectedChoice = null
  answered = false
  // ページ全体を再描画
  const app = document.getElementById('app')
  if (app) {
    const path = currentTopic ? `/quiz/${currentTopic}` : '/quiz'
    app.innerHTML = renderQuiz(path, currentTopic ? [currentTopic, currentMode] : ['', currentMode])
    bindQuizEvents(app)
  }
}
