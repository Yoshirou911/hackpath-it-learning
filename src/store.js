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
    sg: { completed: 0, total: 0, completedLessonIds: [] },
    sc: { completed: 0, total: 0, completedLessonIds: [] },
    nwsp: { completed: 0, total: 0, completedLessonIds: [] },
    dbsp: { completed: 0, total: 0, completedLessonIds: [] },
    pmcert: { completed: 0, total: 0, completedLessonIds: [] },
    st: { completed: 0, total: 0, completedLessonIds: [] },
    awsclf: { completed: 0, total: 0, completedLessonIds: [] },
    ccna: { completed: 0, total: 0, completedLessonIds: [] },
    linuc1: { completed: 0, total: 0, completedLessonIds: [] },
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
  daily: {},
  review: {},
}

// 間隔反復の復習間隔（日）。連続正解が伸びるほど次の復習を先送りする。
const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30, 60]
const REVIEW_MAX_ENTRIES = 10_000
const DAY_MS = 86_400_000

// 日別成績は直近180日だけ保持し、保存サイズの増加を抑える。
const DAILY_RETENTION_DAYS = 180
const DAILY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const EMPTY_DAILY_ENTRY = { answered: 0, correct: 0, lessons: 0, xp: 0 }

export function toDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
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
  const history = Array.isArray(value.history) ? value.history.slice(0, 100) : []
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
    history,
    daily: normalizeDaily(value.daily, history),
    review: normalizeReview(value.review),
  }
}

// 復習予定を持たない旧データは空で開始し、次の回答から段階的に蓄積する。
function normalizeReview(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const review = {}
  Object.entries(value).slice(0, REVIEW_MAX_ENTRIES).forEach(([key, entry]) => {
    if (!entry || typeof entry !== 'object' || key.length > 120) return
    const lastAt = Number(entry.lastAt)
    if (!Number.isFinite(lastAt) || lastAt <= 0) return
    review[key] = {
      lastAt: Math.floor(lastAt),
      streak: Math.max(0, Math.min(REVIEW_INTERVAL_DAYS.length, Math.floor(Number(entry.streak) || 0))),
    }
  })
  return review
}

// `daily`を持たない旧データは、保存済み履歴から日別成績を一度だけ復元する。
function normalizeDaily(value, history) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return trimDaily(deriveDailyFromHistory(history))
  const daily = {}
  Object.entries(value).forEach(([key, entry]) => {
    if (!DAILY_KEY_PATTERN.test(key) || !entry || typeof entry !== 'object') return
    daily[key] = {
      answered: clampCount(entry.answered),
      correct: clampCount(entry.correct),
      lessons: clampCount(entry.lessons),
      xp: clampCount(entry.xp),
    }
  })
  return trimDaily(daily)
}

function deriveDailyFromHistory(history) {
  const daily = {}
  history.forEach((entry) => {
    const key = toDateKey(entry?.timestamp)
    if (!key || !DAILY_KEY_PATTERN.test(key)) return
    const day = daily[key] || { ...EMPTY_DAILY_ENTRY }
    if (entry.type === 'quiz') {
      day.answered += 1
      if (entry.data?.isCorrect) {
        day.correct += 1
        day.xp += entry.data?.corrected ? 8 : 10
      } else {
        day.xp += 2
      }
    } else if (entry.type === 'lesson') {
      day.lessons += 1
    }
    daily[key] = day
  })
  return daily
}

function trimDaily(daily) {
  const keys = Object.keys(daily).sort()
  if (keys.length <= DAILY_RETENTION_DAYS) return daily
  return Object.fromEntries(keys.slice(-DAILY_RETENTION_DAYS).map((key) => [key, daily[key]]))
}

function clampCount(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.max(0, Math.min(1_000_000, Math.floor(number)))
}

function addDailyRecord(delta, timestamp = new Date()) {
  const key = toDateKey(timestamp)
  if (!key) return
  const day = { ...EMPTY_DAILY_ENTRY, ...(state.daily[key] || {}) }
  day.answered += delta.answered || 0
  day.correct += delta.correct || 0
  day.lessons += delta.lessons || 0
  day.xp += delta.xp || 0
  state.daily = trimDaily({ ...state.daily, [key]: day })
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
    daily: mergeDaily(remote.daily, local.daily),
    review: mergeReview(remote.review, local.review),
    flashcards: { ...remote.flashcards, ...local.flashcards },
    history: local.history.length >= remote.history.length ? local.history : remote.history,
    lastVisited: local.lastVisited || remote.lastVisited,
  })
}

// 同じ日を両端末で学習した場合は、取りこぼしを避けて多い方の記録を採用する。
function mergeDaily(remoteDaily, localDaily) {
  const merged = { ...remoteDaily }
  Object.entries(localDaily).forEach(([key, localDay]) => {
    const remoteDay = merged[key] || EMPTY_DAILY_ENTRY
    merged[key] = {
      answered: Math.max(remoteDay.answered || 0, localDay.answered || 0),
      correct: Math.max(remoteDay.correct || 0, localDay.correct || 0),
      lessons: Math.max(remoteDay.lessons || 0, localDay.lessons || 0),
      xp: Math.max(remoteDay.xp || 0, localDay.xp || 0),
    }
  })
  return merged
}

// 復習予定は最後に回答した端末の記録を採用する。
function mergeReview(remoteReview, localReview) {
  const merged = { ...remoteReview }
  Object.entries(localReview).forEach(([key, localEntry]) => {
    const remoteEntry = merged[key]
    merged[key] = !remoteEntry || localEntry.lastAt >= remoteEntry.lastAt ? localEntry : remoteEntry
  })
  return merged
}

export function getState() {
  return state
}

export function getDailyStats() {
  return state.daily
}

// ─── 間隔反復（復習スケジュール） ───────────────────────────────────────────
// 到達度は`quiz.answered`、定着度は`review`が持つ。正解済みの問題を復習で間違えても
// 到達度とXPは下げず、復習の連続正解だけを0へ戻して早めに再出題する。

function updateReviewSchedule(questionId, isCorrect, now = Date.now()) {
  const key = String(questionId)
  const previousStreak = state.review[key]?.streak || 0
  const streak = isCorrect ? Math.min(previousStreak + 1, REVIEW_INTERVAL_DAYS.length) : 0
  if (Object.keys(state.review).length >= REVIEW_MAX_ENTRIES && !(key in state.review)) return
  state.review[key] = { lastAt: now, streak }
}

export function getReviewSchedule() {
  return state.review
}

export function getReviewDueAt(entry) {
  if (!entry) return 0
  const days = entry.streak > 0 ? REVIEW_INTERVAL_DAYS[entry.streak - 1] : 0
  return entry.lastAt + days * DAY_MS
}

export function getReviewStatus(questionId, now = Date.now()) {
  const entry = state.review[String(questionId)]
  if (!entry) return { tracked: false, streak: 0, lastAt: 0, dueAt: 0, isDue: false, daysUntilDue: 0 }
  const dueAt = getReviewDueAt(entry)
  return {
    tracked: true,
    streak: entry.streak,
    lastAt: entry.lastAt,
    dueAt,
    isDue: dueAt <= now,
    daysUntilDue: Math.max(0, Math.ceil((dueAt - now) / DAY_MS)),
  }
}

// 期日を過ぎた問題を、期日が古い順（同じなら連続正解が少ない順）に並べる。
export function getDueReviewQuestions(questionList, now = Date.now()) {
  return questionList
    .filter((question) => {
      const entry = state.review[String(question.id)]
      return Boolean(entry) && getReviewDueAt(entry) <= now
    })
    .sort((a, b) => {
      const entryA = state.review[String(a.id)]
      const entryB = state.review[String(b.id)]
      return getReviewDueAt(entryA) - getReviewDueAt(entryB) || entryA.streak - entryB.streak
    })
}

export function getReviewSummary(questionList, now = Date.now()) {
  let due = 0
  let scheduled = 0
  let mastered = 0
  questionList.forEach((question) => {
    const entry = state.review[String(question.id)]
    if (!entry) return
    scheduled += 1
    if (getReviewDueAt(entry) <= now) due += 1
    if (entry.streak >= REVIEW_INTERVAL_DAYS.length) mastered += 1
  })
  return { due, scheduled, mastered, untracked: questionList.length - scheduled }
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
  addDailyRecord({ xp: amount })
  saveState(state)
  return state
}

export function recordQuizAnswer(questionId, isCorrect, topicId = null) {
  const previousAnswer = state.quiz.answered[questionId]
  updateReviewSchedule(questionId, isCorrect)
  addDailyRecord({ answered: 1, correct: isCorrect ? 1 : 0 })

  // 復習での再回答。到達度(answered)・XP・履歴は増やさず、復習予定と日別記録だけ更新する。
  if (previousAnswer === true || (previousAnswer === false && !isCorrect)) {
    saveState(state)
    return state
  }

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
    addDailyRecord({ lessons: 1 })
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

// ─── 演習ラボ（端末内保存・クラウド同期なし） ──────────────────────────────
// 書きかけのコードと合格記録は端末だけに保存し、XP・進捗・クラウド保存形式へは影響させない。

const LAB_DRAFTS_KEY = 'hackpath-lab-drafts'
const LAB_CLEARED_KEY = 'hackpath-lab-cleared'
const LAB_DRAFT_MAX_LENGTH = 20_000

function readLabRecord(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '{}')
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  } catch {
    return {}
  }
}

export function getLabDraft(exerciseId) {
  const draft = readLabRecord(LAB_DRAFTS_KEY)[exerciseId]
  return typeof draft === 'string' ? draft : null
}

export function saveLabDraft(exerciseId, code) {
  const drafts = readLabRecord(LAB_DRAFTS_KEY)
  drafts[exerciseId] = String(code).slice(0, LAB_DRAFT_MAX_LENGTH)
  localStorage.setItem(LAB_DRAFTS_KEY, JSON.stringify(drafts))
}

export function clearLabDraft(exerciseId) {
  const drafts = readLabRecord(LAB_DRAFTS_KEY)
  delete drafts[exerciseId]
  localStorage.setItem(LAB_DRAFTS_KEY, JSON.stringify(drafts))
}

export function getClearedLabExercises() {
  return readLabRecord(LAB_CLEARED_KEY)
}

export function isLabExerciseCleared(exerciseId) {
  return Boolean(getClearedLabExercises()[exerciseId])
}

export function markLabExerciseCleared(exerciseId) {
  const cleared = getClearedLabExercises()
  if (cleared[exerciseId]) return cleared
  cleared[exerciseId] = new Date().toISOString()
  localStorage.setItem(LAB_CLEARED_KEY, JSON.stringify(cleared))
  return cleared
}
