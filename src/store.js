import { getQuestionsByTopic } from './data/questions.js'

const STORAGE_KEY = 'hackpath-progress'
const STORAGE_OWNER_KEY = 'hackpath-progress-owner'

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
    programming: { completed: 0, total: 0, completedLessonIds: [] },
    cloud: { completed: 0, total: 0, completedLessonIds: [] },
    ai: { completed: 0, total: 0, completedLessonIds: [] },
    git: { completed: 0, total: 0, completedLessonIds: [] },
    sysdesign: { completed: 0, total: 0, completedLessonIds: [] },
    stack: { completed: 0, total: 0, completedLessonIds: [] },
    data: { completed: 0, total: 0, completedLessonIds: [] },
    mobile: { completed: 0, total: 0, completedLessonIds: [] },
    iot: { completed: 0, total: 0, completedLessonIds: [] },
    sre: { completed: 0, total: 0, completedLessonIds: [] },
    ux: { completed: 0, total: 0, completedLessonIds: [] },
    governance: { completed: 0, total: 0, completedLessonIds: [] },
    sovereign: { completed: 0, total: 0, completedLessonIds: [] },
  },
  flashcards: {},
  lastVisited: '/',
  history: [],
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_STATE)
    return normalizeState(JSON.parse(raw))
  } catch {
    return structuredClone(DEFAULT_STATE)
  }
}

function normalizeState(value) {
  const defaults = structuredClone(DEFAULT_STATE)
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaults
  const xp = Number.isFinite(Number(value.xp)) ? Math.max(0, Math.floor(Number(value.xp))) : 0
  const rawQuiz = value.quiz && typeof value.quiz === 'object' ? value.quiz : {}
  const answered = rawQuiz.answered && typeof rawQuiz.answered === 'object' ? rawQuiz.answered : {}
  const rawTopics = value.topics && typeof value.topics === 'object' ? value.topics : {}
  const topics = { ...defaults.topics }
  Object.entries(rawTopics).forEach(([id, topic]) => {
    if (!topic || typeof topic !== 'object') return
    topics[id] = { ...(topics[id] || {}), ...topic }
    topics[id].completedLessonIds ??= []
  })
  return {
    ...defaults,
    ...value,
    xp,
    level: Math.floor(xp / 100) + 1,
    quiz: {
      answered,
      correct: Object.values(answered).filter(Boolean).length,
      total: Object.keys(answered).length,
    },
    topics,
    flashcards: value.flashcards && typeof value.flashcards === 'object' ? value.flashcards : {},
    history: Array.isArray(value.history) ? value.history.slice(0, 100) : [],
  }
}

let state = loadState()
let cloudAccount = {
  status: 'checking',
  user: null,
  signInUrl: '/signin-with-chatgpt?return_to=%2F%23%2F',
}
let cloudReady = false
let cloudSaveTimer = null
let cloudSavePending = false
let cloudSaveInFlight = false
let cloudEventsBound = false

function saveState(nextState, options = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  if (!options.localOnly) queueCloudSave()
}

export function getCloudAccount() {
  return cloudAccount
}

export async function initCloudProgress() {
  try {
    const meResponse = await fetch('/api/me', { headers: { Accept: 'application/json' } })
    const me = await meResponse.json()
    if (!me.authenticated) {
      cloudAccount = {
        status: 'anonymous',
        user: null,
        signInUrl: me.signInUrl || cloudAccount.signInUrl,
      }
      return cloudAccount
    }

    cloudAccount = { status: 'syncing', user: me.user, signInUrl: null }
    const ownerKey = String(me.user?.email || '').toLowerCase()
    const savedOwnerKey = localStorage.getItem(STORAGE_OWNER_KEY)
    if (savedOwnerKey && savedOwnerKey !== ownerKey) {
      state = structuredClone(DEFAULT_STATE)
      saveState(state, { localOnly: true })
    }
    const progressResponse = await fetch('/api/progress', { headers: { Accept: 'application/json' } })
    if (!progressResponse.ok) throw new Error('Progress download failed')
    const remote = await progressResponse.json()
    if (remote.progress) {
      const localState = state
      const canMergeThisDevice = savedOwnerKey === ownerKey
      state = canMergeThisDevice ? mergeProgress(remote.progress, localState) : normalizeState(remote.progress)
      saveState(state, { localOnly: true })
      if (canMergeThisDevice && JSON.stringify(state) !== JSON.stringify(normalizeState(remote.progress))) {
        await uploadProgress(state)
      }
    } else {
      await uploadProgress(state)
    }
    localStorage.setItem(STORAGE_OWNER_KEY, ownerKey)
    cloudReady = true
    cloudAccount = { ...cloudAccount, status: 'synced' }
    bindCloudFlushEvents()
    return cloudAccount
  } catch {
    cloudReady = false
    cloudAccount = { ...cloudAccount, status: 'offline' }
    return cloudAccount
  }
}

function queueCloudSave() {
  if (!cloudReady) return
  cloudSavePending = true
  window.clearTimeout(cloudSaveTimer)
  cloudSaveTimer = window.setTimeout(flushCloudProgress, 500)
}

async function flushCloudProgress() {
  if (!cloudReady || cloudSaveInFlight || !cloudSavePending) return
  cloudSavePending = false
  cloudSaveInFlight = true
  try {
    await uploadProgress(state)
    cloudAccount = { ...cloudAccount, status: 'synced' }
  } catch {
    cloudAccount = { ...cloudAccount, status: 'offline' }
  } finally {
    cloudSaveInFlight = false
    if (cloudSavePending) queueCloudSave()
  }
}

async function uploadProgress(progress) {
  const response = await fetch('/api/progress', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ progress }),
    keepalive: true,
  })
  if (!response.ok) throw new Error('Progress upload failed')
  return response.json()
}

function bindCloudFlushEvents() {
  if (cloudEventsBound) return
  cloudEventsBound = true
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushCloudProgress()
  })
  window.addEventListener('pagehide', flushCloudProgress)
}

// 同一アカウントで更新直後に再読込しても、未送信の端末進捗を古いクラウド値で失わない。
function mergeProgress(remoteValue, localValue) {
  const remote = normalizeState(remoteValue)
  const local = normalizeState(localValue)
  const answered = { ...remote.quiz.answered }
  Object.entries(local.quiz.answered).forEach(([id, result]) => {
    answered[id] = answered[id] === true || result === true ? true : false
  })
  const topics = { ...remote.topics }
  Object.entries(local.topics).forEach(([id, localTopic]) => {
    const remoteTopic = topics[id] || {}
    topics[id] = {
      ...remoteTopic,
      ...localTopic,
      completed: Math.max(Number(remoteTopic.completed) || 0, Number(localTopic.completed) || 0),
      total: Math.max(Number(remoteTopic.total) || 0, Number(localTopic.total) || 0),
      completedLessonIds: [...new Set([...(remoteTopic.completedLessonIds || []), ...(localTopic.completedLessonIds || [])])],
    }
  })
  return normalizeState({
    ...remote,
    xp: Math.max(remote.xp, local.xp),
    quiz: { answered },
    topics,
    flashcards: { ...remote.flashcards, ...local.flashcards },
    history: local.history.length >= remote.history.length ? local.history : remote.history,
    lastVisited: local.lastVisited || remote.lastVisited,
  })
}

export function getState() {
  return state
}

export function resetProgress() {
  state = structuredClone(DEFAULT_STATE)
  saveState(state)
}

export function clearLocalSession() {
  cloudReady = false
  state = structuredClone(DEFAULT_STATE)
  localStorage.removeItem(STORAGE_OWNER_KEY)
  saveState(state, { localOnly: true })
}

export function addXP(amount) {
  state.xp += amount
  state.level = Math.floor(state.xp / 100) + 1
  saveState(state)
  return state
}

export function recordQuizAnswer(questionId, isCorrect, topicId = null) {
  const previousAnswer = state.quiz.answered[questionId]
  if (previousAnswer === true || (previousAnswer === false && !isCorrect)) return state

  if (previousAnswer === false && isCorrect) {
    state.quiz.answered[questionId] = true
    state.quiz.correct += 1
    addXP(8)
    if (topicId) syncTopicProgressFromQuiz(topicId)
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
  if (topicId) syncTopicProgressFromQuiz(topicId)
  addHistoryEntry('quiz', { questionId, isCorrect })
  saveState(state)
  return state
}

// 問題IDが数値の資格コースと文字列の実務コースの両方に対応する。
function syncTopicProgressFromQuiz(topicId) {
  const topicQuestions = getQuestionsByTopic(topicId)
  const questionIds = new Set(topicQuestions.map((question) => String(question.id)))
  const correctCount = Object.entries(state.quiz.answered)
    .filter(([id, correct]) => questionIds.has(String(id)) && correct === true)
    .length
  const topic = state.topics[topicId] || { completedLessonIds: [] }
  topic.completedLessonIds ??= []
  topic.completed = correctCount
  topic.total = topicQuestions.length
  state.topics[topicId] = topic
  return topic
}

export function getTopicQuizProgress(topicId) {
  const topic = syncTopicProgressFromQuiz(topicId)
  saveState(state)
  const pct = topic.total > 0 ? Math.round((topic.completed / topic.total) * 100) : 0
  return { ...topic, pct }
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

// ─── カスタムレッスン管理（独立したlocalStorageキー） ───────────────────────

const CUSTOM_LESSONS_KEY = 'hackpath-custom-lessons'

export function getCustomLessons() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_LESSONS_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveCustomLesson({ id, topicId, title, content, tags = '' }) {
  const lessons = getCustomLessons()
  const now = Date.now()
  if (id) {
    const idx = lessons.findIndex(l => l.id === id)
    if (idx >= 0) {
      lessons[idx] = { ...lessons[idx], topicId, title, content, tags, updatedAt: now }
    } else {
      lessons.push({ id, topicId, title, content, tags, createdAt: now, updatedAt: now })
    }
  } else {
    lessons.push({ id: `custom-${now}`, topicId, title, content, tags, createdAt: now, updatedAt: now })
  }
  localStorage.setItem(CUSTOM_LESSONS_KEY, JSON.stringify(lessons))
}

export function deleteCustomLesson(id) {
  const lessons = getCustomLessons().filter(l => l.id !== id)
  localStorage.setItem(CUSTOM_LESSONS_KEY, JSON.stringify(lessons))
}
