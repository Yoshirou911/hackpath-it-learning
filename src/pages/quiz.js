import { questions, getQuestionsByTopic } from '../data/questions.js'
import { recordQuizAnswer, getQuizStats, getState } from '../store.js'
import { roadmapTopics } from '../data/topics.js'
import { navigate } from '../router.js'

let currentQuestionIndex = 0
let currentQuestions = []
let selectedChoice = null
let answered = false

export function renderQuiz(path, params) {
  const topicFilter = params[0]
  currentQuestions = topicFilter ? getQuestionsByTopic(topicFilter) : [...questions]
  currentQuestionIndex = 0
  selectedChoice = null
  answered = false

  const stats = getQuizStats()
  const state = getState()

  const topicOptions = [
    { value: '', label: 'すべての問題' },
    ...roadmapTopics
      .filter((topic) => getQuestionsByTopic(topic.id).length > 0)
      .map((topic) => ({ value: topic.id, label: topic.title })),
  ]

  return `
    <div class="page-header">
      <h1>問題演習</h1>
      <p class="page-subtitle">知識を定着させよう</p>
    </div>

    <div class="glass-card" style="margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
        <div>
          <span style="font-size: 14px; color: var(--text); opacity: 0.7;">トピック:</span>
          <select id="topic-filter" style="padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg); color: var(--text-h); margin-left: 8px;">
            ${topicOptions.map(opt => `
              <option value="${opt.value}" ${topicFilter === opt.value ? 'selected' : ''}>${opt.label}</option>
            `).join('')}
          </select>
        </div>
        <div style="margin-left: auto;">
          <span style="font-size: 14px; color: var(--text); opacity: 0.7;">回答済み: ${stats.answered}/${questions.length} | 正答率: ${stats.accuracy}%</span>
        </div>
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
    return `
      <div class="glass-card" style="text-align: center; padding: 48px;">
        <p style="font-size: 18px; margin-bottom: 16px;">問題がありません</p>
        <a href="#/roadmap" class="btn btn-secondary" data-nav="/roadmap">ロードマップに戻る</a>
      </div>
    `
  }

  if (currentQuestionIndex >= currentQuestions.length) {
    const stats = getQuizStats()
    return `
      <div class="glass-card" style="text-align: center; padding: 48px;">
        <h2 style="margin-bottom: 16px;">🎉 クイズ完了！</h2>
        <p style="font-size: 18px; margin-bottom: 24px;">
          正答率: <strong>${stats.accuracy}%</strong> (${stats.correct}/${stats.total}問正解)
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-primary" id="restart-quiz">もう一度挑戦</button>
          <a href="#/" class="btn btn-secondary" data-nav="/">ダッシュボードへ</a>
        </div>
      </div>
    `
  }

  const question = currentQuestions[currentQuestionIndex]
  const stats = getQuizStats()

  return `
    <div class="glass-card question-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <span style="font-size: 14px; color: var(--text); opacity: 0.7;">
          問題 ${currentQuestionIndex + 1} / ${currentQuestions.length}
        </span>
        <span style="font-size: 14px; color: var(--text); opacity: 0.7;">
          トピック: ${question.topic.toUpperCase()}
        </span>
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
  const topicFilter = container.querySelector('#topic-filter')
  if (topicFilter) {
    topicFilter.addEventListener('change', (e) => {
      const value = e.target.value
      navigate(value ? `/quiz/${value}` : '/quiz')
    })
  }

  const restartBtn = container.querySelector('#restart-quiz')
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentQuestionIndex = 0
      selectedChoice = null
      answered = false
      container.querySelector('#quiz-content').innerHTML = renderQuestionCard()
      bindQuizEvents(container)
    })
  }

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
