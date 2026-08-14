import { questions, getQuestionsByTopic } from '../data/questions.js'
import { recordQuizAnswer, getQuizStats, getState } from '../store.js'
import { roadmapTopics } from '../data/topics.js'
import { navigate } from '../router.js'
import { getAccountRank } from '../data/ranks.js'
import { isSoundEnabled, playAnswerSound, playClearSound, showClearCelebration, toggleSound } from '../components/effects.js'
import { getFeMockQuestions, getFeMockSpec } from '../data/feMockExam.js'

let currentQuestionIndex = 0
let currentQuestions = []
let selectedChoice = null
let textAnswer = ''
let answered = false
let currentMode = 'all'
let currentTopic = ''
let currentRankFilter = 'all'
let sessionCorrect = 0
let sessionAnswered = 0
let activeMockKey = ''
let mockDeadline = 0
let mockTimerId = null

const QUIZ_MODES = ['all', 'weak', 'unanswered', 'incorrect', 'section-a', 'section-b', 'mock-a', 'mock-b-1', 'mock-b-2']
const RANK_FILTERS = ['all', 'bronze', 'silver', 'gold', 'sovereign']

// mode: 'all' | 'weak' | 'unanswered' | 'incorrect' | 'section-a' | 'section-b'
function filterQuestions(base, mode) {
  const state = getState()
  const answeredMap = state.quiz.answered || {}
  const mockQuestions = getFeMockQuestions(base, mode)
  if (mockQuestions) return mockQuestions
  if (mode === 'section-a') return base.filter(q => (q.examSection || 'A') === 'A')
  if (mode === 'section-b') return base.filter(q => q.examSection === 'B')
  if (mode === 'unanswered') return base.filter(q => !(q.id in answeredMap))
  if (mode === 'incorrect') return base.filter(q => answeredMap[q.id] === false)
  if (mode === 'weak') {
    return [...base].sort((a, b) => weaknessScore(b, answeredMap) - weaknessScore(a, answeredMap)
      || stableQuestionOrder(a.id) - stableQuestionOrder(b.id))
  }
  return base
}

function weaknessScore(question, answeredMap) {
  const result = answeredMap[question.id]
  const answerWeight = result === false ? 5 : result === true ? 1 : 3
  return answerWeight * 10 + (Number(question.difficulty) || 0)
}

function stableQuestionOrder(id) {
  return [...String(id)].reduce((total, character) => total + character.charCodeAt(0), 0)
}

export function renderQuiz(path, params = []) {
  const requestedTopic = params[0] || ''
  currentTopic = requestedTopic === 'all' ? '' : requestedTopic
  const requestedMode = params[1] || 'all'
  const supportsExamSections = currentTopic === 'fe'
  const feOnlyMode = requestedMode.startsWith('section-') || requestedMode.startsWith('mock-')
  currentMode = QUIZ_MODES.includes(requestedMode)
    && (supportsExamSections || !feOnlyMode)
    ? requestedMode
    : 'all'
  currentRankFilter = RANK_FILTERS.includes(params[2]) ? params[2] : 'all'
  const mockSpec = getFeMockSpec(currentMode)
  if (mockSpec) currentRankFilter = 'all'
  prepareMockTimer(currentMode, mockSpec)

  const topicQuestions = currentTopic ? getQuestionsByTopic(currentTopic) : [...questions]
  const baseQuestions = filterQuestionsByRank(topicQuestions, currentRankFilter)
  currentQuestions = filterQuestions(baseQuestions, currentMode)
  currentQuestionIndex = 0
  selectedChoice = null
  textAnswer = ''
  answered = false
  sessionCorrect = 0
  sessionAnswered = 0

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
    { value: 'weak',       label: '苦手優先',                    icon: '🎯' },
    { value: 'unanswered', label: `未回答 (${totalUnanswered})`, icon: '❓' },
    { value: 'incorrect',  label: `不正解 (${totalIncorrect})`,  icon: '❌' },
    ...(currentTopic === 'fe' ? [
      { value: 'section-a', label: `科目A (${baseQuestions.filter(q => (q.examSection || 'A') === 'A').length})`, icon: '🧠' },
      { value: 'section-b', label: `科目B (${baseQuestions.filter(q => q.examSection === 'B').length})`, icon: '⌘' },
      { value: 'mock-a', label: '模試A 60問', icon: '⏱' },
      { value: 'mock-b-1', label: '模試B-1 20問', icon: 'Ⅰ' },
      { value: 'mock-b-2', label: '模試B-2 20問', icon: 'Ⅱ' },
    ] : []),
  ]
  const rankOptions = [
    { value: 'all', label: 'ALL RANKS', sub: '全階級' },
    { value: 'bronze', label: 'BRONZE', sub: '基礎' },
    { value: 'silver', label: 'SILVER', sub: '応用' },
    { value: 'gold', label: 'GOLD', sub: '上級' },
    { value: 'sovereign', label: 'SOVEREIGN', sub: '超高難度' },
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
        <button class="mode-tab-btn sound-toggle" id="sound-toggle" type="button" aria-pressed="${isSoundEnabled()}">${isSoundEnabled() ? '🔊 効果音 ON' : '🔇 効果音 OFF'}</button>
      </div>
      <div class="quiz-rank-filter ${mockSpec ? 'is-disabled-for-mock' : ''}" aria-label="問題ランク選択">
        <span>DIFFICULTY ACCESS</span>
        ${rankOptions.map((rank) => {
          const questionCount = filterQuestionsByRank(topicQuestions, rank.value).length
          return `
            <button type="button" class="quiz-rank-option rank-surface-${rank.value === 'all' ? 'platinum' : rank.value} ${currentRankFilter === rank.value ? 'is-active' : ''}" data-rank-filter="${rank.value}" ${questionCount === 0 || mockSpec ? 'disabled aria-disabled="true"' : ''}>
              <b>${rank.label}</b><small>${rank.sub} · ${questionCount}問</small>
            </button>
          `
        }).join('')}
      </div>
    </div>

    ${renderMockBanner(mockSpec)}

    <div class="quiz-container">
      ${renderCategoryInsights(baseQuestions, answeredMap)}
      <div id="quiz-content">
        ${renderQuestionCard()}
      </div>
    </div>
  `
}

function renderCategoryInsights(baseQuestions, answeredMap) {
  const categories = new Map()
  baseQuestions.filter((question) => question.category).forEach((question) => {
    const current = categories.get(question.category) || { total: 0, answered: 0, correct: 0 }
    current.total += 1
    if (question.id in answeredMap) current.answered += 1
    if (answeredMap[question.id] === true) current.correct += 1
    categories.set(question.category, current)
  })
  if (!categories.size) return ''

  const rows = [...categories.entries()].map(([name, values]) => ({
    name,
    ...values,
    accuracy: values.answered ? Math.round((values.correct / values.answered) * 100) : null,
  })).sort((a, b) => (a.accuracy ?? -1) - (b.accuracy ?? -1) || b.total - a.total).slice(0, 6)

  return `
    <section class="glass-card weakness-panel">
      <div><span class="eyebrow">WEAKNESS SCAN</span><h2>分野別の理解度</h2><p>未回答・正答率が低い分野から表示しています。</p></div>
      <div class="weakness-grid">
        ${rows.map((row) => `
          <div class="weakness-item">
            <div><strong>${row.name}</strong><span>${row.answered}/${row.total}問回答</span></div>
            <b>${row.accuracy === null ? '未回答' : `${row.accuracy}%`}</b>
          </div>
        `).join('')}
      </div>
    </section>
  `
}

function renderQuestionCard() {
  if (currentQuestions.length === 0) {
    const emptyMessages = {
      unanswered: { emoji: '🎉', title: '未回答の問題はありません！', sub: 'すべての問題に回答しました。不正解の問題を復習しましょう。' },
      incorrect:  { emoji: '✨', title: '不正解の問題はありません！', sub: 'すべての問題を正解しています。素晴らしい！' },
      'section-a': { emoji: '🧠', title: '科目Aの問題がありません', sub: '分野または難易度フィルターを確認してください。' },
      'section-b': { emoji: '⌘', title: '科目Bの問題がありません', sub: '分野または難易度フィルターを確認してください。' },
      'mock-a': { emoji: '⏱', title: '科目A模試を開始できません', sub: '問題データを確認してください。' },
      'mock-b-1': { emoji: '⏱', title: '科目B模試1を開始できません', sub: '問題データを確認してください。' },
      'mock-b-2': { emoji: '⏱', title: '科目B模試2を開始できません', sub: '問題データを確認してください。' },
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
    const correct = sessionCorrect
    const resultTotal = sessionAnswered || currentQuestions.length
    return `
      <div class="glass-card" style="text-align: center; padding: 48px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
        <h2 style="margin-bottom: 8px;">クイズ完了！</h2>
        <p style="font-size: 18px; margin-bottom: 24px;">
          今回の正答率: <strong>${resultTotal > 0 ? Math.round((correct / resultTotal) * 100) : 0}%</strong>
          (${correct}/${resultTotal}問正解)
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
          ${question.topic === 'fe' ? `<span class="fe-section-chip fe-section-${(question.examSection || 'A').toLowerCase()}">科目${question.examSection || 'A'}</span>` : ''}
          <span class="question-rank-chip rank-surface-${getQuestionRank(question)}">${getQuestionRank(question).toUpperCase()}</span>
        </div>
      </div>

      <!-- 進捗バー -->
      <div style="height: 4px; background: var(--border); border-radius: 2px; margin-bottom: 20px; overflow: hidden;">
        <div style="height: 100%; width: ${((currentQuestionIndex) / currentQuestions.length) * 100}%; background: var(--accent); border-radius: 2px; transition: width 0.3s;"></div>
      </div>
      
      <p class="question-text">${question.question}</p>

      ${question.pseudocode ? `<pre class="quiz-pseudocode"><code>${escapeHtml(question.pseudocode)}</code></pre>` : ''}

      ${question.inputType === 'text' ? `
        <div class="text-answer-area">
          <label for="text-answer">答えを入力</label>
          <input id="text-answer" type="text" value="${escapeHtml(textAnswer)}" autocomplete="off" ${answered ? 'disabled' : ''} placeholder="例：9 または {1, 2, 3}">
          ${answered ? `<p class="text-answer-result ${normalizeAnswer(textAnswer) === normalizeAnswer(question.expectedAnswer) ? 'correct' : 'incorrect'}">正解：${escapeHtml(question.expectedAnswer)}</p>` : ''}
        </div>
      ` : `<ul class="choices-list" role="radiogroup" aria-label="選択肢">
        ${question.choices.map((choice, index) => `
          <li class="choice-item ${selectedChoice === index ? 'selected' : ''} ${answered && index === question.answer ? 'correct' : ''} ${answered && selectedChoice === index && index !== question.answer ? 'incorrect' : ''}" 
              data-choice="${index}" 
              role="radio"
              aria-checked="${selectedChoice === index}"
              aria-disabled="${answered}"
              tabindex="${answered ? '-1' : '0'}"
              ${answered ? 'style="pointer-events: none;"' : ''}>
            <span style="margin-right: 12px; font-weight: 500;">${String.fromCharCode(65 + index)}.</span>
            ${choice}
          </li>
        `).join('')}
      </ul>`}

      <div class="explanation ${answered ? 'visible' : ''}">
        <strong>解説:</strong>
        <p style="margin-top: 8px;">${question.explanation}</p>
      </div>

      <div class="quiz-nav">
        <button class="btn btn-secondary" id="prev-question" ${currentQuestionIndex === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
          ← 前の問題
        </button>
        
        ${!answered ? `
          <button class="btn btn-primary" id="submit-answer" ${(question.inputType === 'text' ? !textAnswer.trim() : selectedChoice === null) ? 'disabled style="opacity: 0.5;"' : ''}>
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
  bindMockClock(container)
  const soundToggle = container.querySelector('#sound-toggle')
  soundToggle?.addEventListener('click', () => {
    const enabled = toggleSound()
    soundToggle.textContent = enabled ? '🔊 効果音 ON' : '🔇 効果音 OFF'
    soundToggle.setAttribute('aria-pressed', String(enabled))
  })
  container.querySelectorAll('[data-rank-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      currentRankFilter = button.dataset.rankFilter
      _reloadWithCurrentSettings()
    })
  })
  // 分野フィルター
  const topicFilter = container.querySelector('#topic-filter')
  if (topicFilter && !topicFilter.dataset.eventsBound) {
    topicFilter.dataset.eventsBound = 'true'
    topicFilter.addEventListener('change', (e) => {
      currentTopic = e.target.value
      if (currentTopic !== 'fe' && currentMode.startsWith('section-')) currentMode = 'all'
      _reloadWithCurrentSettings()
    })
  }

  // モードタブ
  container.querySelectorAll('[data-mode]').forEach(btn => {
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
      const mockSpec = getFeMockSpec(currentMode)
      if (mockSpec) {
        mockDeadline = Date.now() + mockSpec.minutes * 60 * 1000
        bindMockClock(container)
      }
      const topicQuestions = currentTopic ? getQuestionsByTopic(currentTopic) : [...questions]
      const baseQuestions = filterQuestionsByRank(topicQuestions, currentRankFilter)
      currentQuestions = filterQuestions(baseQuestions, currentMode)
      currentQuestionIndex = 0
      selectedChoice = null
      textAnswer = ''
      answered = false
      sessionCorrect = 0
      sessionAnswered = 0
      container.querySelector('#quiz-content').innerHTML = renderQuestionCard()
      bindQuizEvents(container)
    })
  }

  // 選択肢クリック
  const choices = container.querySelectorAll('.choice-item')
  const selectChoice = (choice) => {
    if (answered) return
    selectedChoice = parseInt(choice.dataset.choice)
    choices.forEach((item) => {
      const isSelected = item === choice
      item.classList.toggle('selected', isSelected)
      item.setAttribute('aria-checked', String(isSelected))
    })

    const submitBtn = container.querySelector('#submit-answer')
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.style.opacity = '1'
    }
  }
  choices.forEach(choice => {
    choice.addEventListener('click', () => selectChoice(choice))
    choice.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        selectChoice(choice)
      }
    })
  })

  const textInput = container.querySelector('#text-answer')
  if (textInput && !answered) {
    textInput.addEventListener('input', () => {
      textAnswer = textInput.value
      const submit = container.querySelector('#submit-answer')
      if (submit) {
        submit.disabled = !textAnswer.trim()
        submit.style.opacity = textAnswer.trim() ? '1' : '0.5'
      }
    })
    textInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && textAnswer.trim()) container.querySelector('#submit-answer')?.click()
    })
  }

  // 回答ボタン
  const submitBtn = container.querySelector('#submit-answer')
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const question = currentQuestions[currentQuestionIndex]
      if (answered || (question.inputType === 'text' ? !textAnswer.trim() : selectedChoice === null)) return
      const isCorrect = question.inputType === 'text'
        ? normalizeAnswer(textAnswer) === normalizeAnswer(question.expectedAnswer)
        : selectedChoice === question.answer
      const previousRank = getAccountRank(getState().xp).current
      answered = true
      sessionAnswered += 1
      if (isCorrect) sessionCorrect += 1
      recordQuizAnswer(question.id, isCorrect, question.topic)
      const nextRank = getAccountRank(getState().xp).current
      playAnswerSound(isCorrect)
      
      container.querySelector('#quiz-content').innerHTML = renderQuestionCard()
      bindQuizEvents(container)
      if (nextRank.id !== previousRank.id) {
        playClearSound()
        showClearCelebration({ rank: nextRank })
      }
    })
  }

  // 次の問題
  const nextBtn = container.querySelector('#next-question')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentQuestionIndex++
      selectedChoice = null
      textAnswer = ''
      answered = false
      container.querySelector('#quiz-content').innerHTML = renderQuestionCard()
      bindQuizEvents(container)
      if (currentQuestionIndex >= currentQuestions.length) {
        playClearSound()
        showClearCelebration()
      }
    })
  }

  // 前の問題
  const prevBtn = container.querySelector('#prev-question')
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--
        selectedChoice = null
        textAnswer = ''
        answered = false
        container.querySelector('#quiz-content').innerHTML = renderQuestionCard()
        bindQuizEvents(container)
      }
    })
  }
}

function _reloadWithCurrentSettings() {
  navigate(getQuizPath(currentTopic, currentMode, currentRankFilter))
}

export function getQuizPath(topic = '', mode = 'all', rankFilter = 'all') {
  return `/quiz/${topic || 'all'}/${mode}/${rankFilter}`
}

function filterQuestionsByRank(base, rankFilter) {
  if (!rankFilter || rankFilter === 'all') return [...base]
  return base.filter((question) => getQuestionRank(question) === rankFilter)
}

function getQuestionRank(question) {
  if (question.level === 'elite' || Number(question.difficulty) >= 7) return 'sovereign'
  if (question.level === 'advanced' || Number(question.difficulty) >= 4) return 'gold'
  if (question.level === 'intermediate' || Number(question.difficulty) === 3) return 'silver'
  return 'bronze'
}

function normalizeAnswer(value) {
  return String(value ?? '').trim().replace(/[\s　]/g, '').toLocaleLowerCase('ja')
}

function prepareMockTimer(mode, spec) {
  if (!spec) {
    activeMockKey = ''
    mockDeadline = 0
    if (mockTimerId) clearInterval(mockTimerId)
    mockTimerId = null
    return
  }
  if (activeMockKey !== mode || mockDeadline <= Date.now()) {
    activeMockKey = mode
    mockDeadline = Date.now() + spec.minutes * 60 * 1000
  }
}

function renderMockBanner(spec) {
  if (!spec) return ''
  return `
    <section class="fe-mock-banner" aria-label="${spec.label}">
      <div><span class="eyebrow">OFFICIAL FORMAT TRAINING</span><h2>${spec.label}</h2><p>${spec.note}</p></div>
      <div class="fe-mock-clock"><span>残り時間</span><strong id="fe-mock-timer">--:--:--</strong><small>${spec.questions}問 / ${spec.minutes}分</small></div>
      <p class="fe-mock-caution">HackPath独自問題による時間配分トレーニングです。再読み込みするとタイマーは最初から始まります。</p>
    </section>
  `
}

function bindMockClock(container) {
  const output = container.querySelector('#fe-mock-timer')
  if (mockTimerId) clearInterval(mockTimerId)
  mockTimerId = null
  if (!output || !mockDeadline) return
  const update = () => {
    const remaining = Math.max(0, mockDeadline - Date.now())
    const totalSeconds = Math.ceil(remaining / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    output.textContent = [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
    output.classList.toggle('is-expired', remaining === 0)
    if (remaining === 0 && mockTimerId) {
      clearInterval(mockTimerId)
      mockTimerId = null
    }
  }
  update()
  mockTimerId = setInterval(update, 1000)
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character])
}
