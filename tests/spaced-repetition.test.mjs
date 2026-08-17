import assert from 'node:assert/strict'
import test from 'node:test'

import { sanitizeProgress } from '../worker/index.js'

const DAY = 86_400_000

function installBrowserMocks(initialStorage = {}) {
  const values = new Map(Object.entries(initialStorage))
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  }
  globalThis.window = globalThis
  globalThis.document = { addEventListener() {}, visibilityState: 'visible' }
  return values
}

test('連続正解が増えるほど次の復習日が先へ延びる', async () => {
  installBrowserMocks()
  const store = await import('../src/store.js?srs-interval')

  const intervals = [1, 3, 7, 14, 30, 60]
  intervals.forEach((expectedDays, index) => {
    const dueAt = store.getReviewDueAt({ lastAt: 0, streak: index + 1 })
    assert.equal(dueAt, expectedDays * DAY, `連続${index + 1}回正解は${expectedDays}日間隔`)
  })

  // 上限を超えても最長間隔で止まる。
  assert.equal(store.getReviewDueAt({ lastAt: 0, streak: 6 }), 60 * DAY)
  assert.equal(store.getReviewDueAt({ lastAt: 0, streak: 0 }), 0)
})

test('正解で連続回数が伸び、不正解で0へ戻る', async () => {
  installBrowserMocks()
  const store = await import('../src/store.js?srs-streak')

  store.recordQuizAnswer('srs-1', true, null)
  assert.equal(store.getReviewStatus('srs-1').streak, 1)

  store.recordQuizAnswer('srs-1', true, null)
  assert.equal(store.getReviewStatus('srs-1').streak, 2)

  store.recordQuizAnswer('srs-1', false, null)
  assert.equal(store.getReviewStatus('srs-1').streak, 0)
  assert.equal(store.getReviewStatus('srs-1').isDue, true)
})

test('復習の再回答ではXPと正解数を二重計上しない', async () => {
  installBrowserMocks()
  const store = await import('../src/store.js?srs-xp')

  store.recordQuizAnswer('srs-xp-1', true, null)
  const afterFirst = { xp: store.getState().xp, correct: store.getState().quiz.correct }

  store.recordQuizAnswer('srs-xp-1', true, null)
  store.recordQuizAnswer('srs-xp-1', false, null)

  const state = store.getState()
  assert.equal(state.xp, afterFirst.xp)
  assert.equal(state.quiz.correct, afterFirst.correct)
  // 到達度は下げず、復習予定だけを更新する。
  assert.equal(state.quiz.answered['srs-xp-1'], true)
  assert.equal(store.getReviewStatus('srs-xp-1').streak, 0)
})

test('復習での再回答も日別成績の回答数へ加算する', async () => {
  installBrowserMocks()
  const store = await import('../src/store.js?srs-daily')

  store.recordQuizAnswer('srs-daily-1', true, null)
  store.recordQuizAnswer('srs-daily-1', false, null)

  const day = store.getDailyStats()[store.toDateKey(new Date())]
  assert.equal(day.answered, 2)
  assert.equal(day.correct, 1)
})

test('復習対象は期日の古い順に並び、未着手の問題は含めない', async () => {
  installBrowserMocks({
    'hackpath-progress': JSON.stringify({
      xp: 0,
      quiz: { answered: {} },
      review: {
        'q-soon': { lastAt: Date.now() - 2 * DAY, streak: 1 },
        'q-old': { lastAt: Date.now() - 40 * DAY, streak: 2 },
        'q-future': { lastAt: Date.now(), streak: 3 },
      },
    }),
  })
  const store = await import('../src/store.js?srs-due')

  const questionList = [{ id: 'q-soon' }, { id: 'q-old' }, { id: 'q-future' }, { id: 'q-new' }]
  const due = store.getDueReviewQuestions(questionList)

  assert.deepEqual(due.map((question) => question.id), ['q-old', 'q-soon'])

  const summary = store.getReviewSummary(questionList)
  assert.deepEqual(summary, { due: 2, scheduled: 3, mastered: 0, untracked: 1 })
})

test('Workerは復習予定を保持し、不正な値を除去する', () => {
  const lastAt = Date.now()
  const sanitized = sanitizeProgress({
    xp: 0,
    review: {
      'q-1': { lastAt, streak: 3 },
      'q-2': { lastAt, streak: 99 },
      'q-3': { lastAt: 0, streak: 1 },
      'q-4': 'invalid',
    },
  })

  assert.deepEqual(Object.keys(sanitized.review), ['q-1', 'q-2'])
  assert.equal(sanitized.review['q-1'].streak, 3)
  assert.equal(sanitized.review['q-2'].streak, 6)
})
