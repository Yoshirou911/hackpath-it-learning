const STORAGE_KEY = 'hackpath-progress'

const DEFAULT_STATE = {
  xp: 0,
  level: 1,
  quiz: {
    answered: {},
    correct: 0,
    total: 0,
  },
  topics: {
    itp: { completed: 0, total: 0 },
    fe: { completed: 0, total: 0 },
    ap: { completed: 0, total: 0 },
    sec: { completed: 0, total: 0 },
    network: { completed: 0, total: 0, completedLessonIds: [] },
    linux: { completed: 0, total: 0, completedLessonIds: [] },
    database: { completed: 0, total: 0, completedLessonIds: [] },
    web: { completed: 0, total: 0, completedLessonIds: [] },
  },
  flashcards: {},
  lastVisited: '/',
  history: [],
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_STATE)
    return { ...structuredClone(DEFAULT_STATE), ...JSON.parse(raw) }
  } catch {
    return structuredClone(DEFAULT_STATE)
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

let state = loadState()

export function getState() {
  return state
}

export function resetProgress() {
  state = structuredClone(DEFAULT_STATE)
  saveState(state)
}

export function addXP(amount) {
  state.xp += amount
  state.level = Math.floor(state.xp / 100) + 1
  saveState(state)
  return state
}

export function recordQuizAnswer(questionId, isCorrect) {
  const previousAnswer = state.quiz.answered[questionId]
  if (previousAnswer === true || (previousAnswer === false && !isCorrect)) return state

  if (previousAnswer === false && isCorrect) {
    state.quiz.answered[questionId] = true
    state.quiz.correct += 1
    addXP(8)
    addHistoryEntry('quiz', { questionId, isCorrect, corrected: true })
    saveState(state)
    return state
  }

  state.quiz.answered[questionId] = isCorrect
  state.quiz.total += 1
  if (isCorrect) {
    state.quiz.correct += 1
    addXP(10)
  } else {
    addXP(2)
  }
  addHistoryEntry('quiz', { questionId, isCorrect })
  saveState(state)
  return state
}

export function getQuizStats() {
  const answered = Object.keys(state.quiz.answered).length
  const accuracy = state.quiz.total > 0
    ? Math.round((state.quiz.correct / state.quiz.total) * 100)
    : 0
  return { answered, correct: state.quiz.correct, total: state.quiz.total, accuracy }
}

export function markFlashcardKnown(termId) {
  state.flashcards[termId] = true
  addXP(5)
  saveState(state)
}

export function setLastVisited(path) {
  state.lastVisited = path
  saveState(state)
}

export function getTopicProgress(topicId, totalLessons) {
  const topic = state.topics[topicId] || { completed: 0, total: totalLessons }
  topic.total = totalLessons
  state.topics[topicId] = topic
  saveState(state)
  const pct = totalLessons > 0 ? Math.round((topic.completed / totalLessons) * 100) : 0
  return { ...topic, pct }
}

export function completeLesson(topicId, totalLessons, lessonId) {
  const topic = state.topics[topicId] || { completed: 0, total: totalLessons, completedLessonIds: [] }
  topic.completedLessonIds ??= []
  if (!topic.completedLessonIds.includes(lessonId) && topic.completed < totalLessons) {
    topic.completedLessonIds.push(lessonId)
    topic.completed += 1
    topic.total = totalLessons
    state.topics[topicId] = topic
    addXP(15)
    addHistoryEntry('lesson', { topicId, lessonId })
    saveState(state)
  }
  return state
}

export function getOverallProgress() {
  const topics = Object.values(state.topics)
  const completed = topics.reduce((s, t) => s + (t.completed || 0), 0)
  const total = topics.reduce((s, t) => s + (t.total || 0), 0)
  return total > 0 ? Math.round((completed / total) * 100) : 0
}

export function addHistoryEntry(type, data) {
  const entry = {
    id: Date.now(),
    type,
    data,
    timestamp: new Date().toISOString(),
  }
  state.history.unshift(entry)
  if (state.history.length > 100) {
    state.history = state.history.slice(0, 100)
  }
  saveState(state)
  return entry
}

export function getHistory(limit = 50) {
  return state.history.slice(0, limit)
}
