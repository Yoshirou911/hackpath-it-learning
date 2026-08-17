import assert from 'node:assert/strict'
import test from 'node:test'

import { buildDailySeries, summarizeDailySeries, DAILY_RANGE_OPTIONS } from '../src/components/dailyStatsChart.js'
import { sanitizeProgress } from '../worker/index.js'

function dateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function daysAgo(base, offset) {
  return dateKey(new Date(base.getFullYear(), base.getMonth(), base.getDate() - offset))
}

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

test('日別集計は活動のない日も0で埋め、古い日から新しい日へ並べる', () => {
  const today = new Date(2026, 7, 17)
  const daily = {
    [daysAgo(today, 0)]: { answered: 5, correct: 4, lessons: 1, xp: 44 },
    [daysAgo(today, 2)]: { answered: 3, correct: 1, lessons: 0, xp: 14 },
  }
  const series = buildDailySeries(daily, 7, today)

  assert.equal(series.length, 7)
  assert.deepEqual(series.map((day) => day.key), [6, 5, 4, 3, 2, 1, 0].map((offset) => daysAgo(today, offset)))
  assert.equal(series[6].answered, 5)
  assert.equal(series[6].isToday, true)
  assert.equal(series[5].answered, 0)
  assert.equal(series[4].accuracy, 33)
  assert.equal(series[4].incorrect, 2)
})

test('正解数は回答数を超えず、期間の合計と正答率を算出する', () => {
  const today = new Date(2026, 7, 17)
  const daily = {
    [daysAgo(today, 0)]: { answered: 4, correct: 9, lessons: 0, xp: 40 },
    [daysAgo(today, 1)]: { answered: 6, correct: 3, lessons: 2, xp: 42 },
  }
  const summary = summarizeDailySeries(buildDailySeries(daily, 14, today))

  assert.equal(summary.answered, 10)
  assert.equal(summary.correct, 7)
  assert.equal(summary.accuracy, 70)
  assert.equal(summary.lessons, 2)
  assert.equal(summary.activeDays, 2)
  assert.equal(summary.maxAnswered, 6)
})

test('当日が未学習でも連続学習日数は前日までの記録を保つ', () => {
  const today = new Date(2026, 7, 17)
  const daily = {
    [daysAgo(today, 1)]: { answered: 2, correct: 2, lessons: 0, xp: 20 },
    [daysAgo(today, 2)]: { answered: 1, correct: 0, lessons: 0, xp: 2 },
    [daysAgo(today, 4)]: { answered: 9, correct: 9, lessons: 0, xp: 90 },
  }
  const summary = summarizeDailySeries(buildDailySeries(daily, 14, today))

  assert.equal(summary.streak, 2)
})

test('期間切替の選択肢は7・14・30日を提供する', () => {
  assert.deepEqual(DAILY_RANGE_OPTIONS.map((option) => option.days), [7, 14, 30])
})

test('問題回答とレッスン完了が当日の日別成績へ記録される', async () => {
  installBrowserMocks()
  const store = await import('../src/store.js?daily-record')

  store.recordQuizAnswer('fe-daily-1', true, null)
  store.recordQuizAnswer('fe-daily-2', false, null)
  store.recordQuizAnswer('fe-daily-2', true, null)
  store.completeLesson('network', 3, 'network-l1')

  const key = store.toDateKey(new Date())
  const day = store.getDailyStats()[key]

  assert.equal(day.answered, 3)
  assert.equal(day.correct, 2)
  assert.equal(day.lessons, 1)
  assert.equal(day.xp, 20)
})

test('日別成績を持たない旧データは保存済み履歴から復元する', async () => {
  const timestamp = new Date(2026, 7, 16, 10, 0, 0).toISOString()
  installBrowserMocks({
    'hackpath-progress': JSON.stringify({
      xp: 22,
      quiz: { answered: { 1: true, 2: false } },
      history: [
        { id: 3, type: 'lesson', data: { topicId: 'fe', lessonId: 'fe-l1' }, timestamp },
        { id: 2, type: 'quiz', data: { questionId: 2, isCorrect: false }, timestamp },
        { id: 1, type: 'quiz', data: { questionId: 1, isCorrect: true }, timestamp },
      ],
    }),
  })
  const store = await import('../src/store.js?daily-backfill')

  const day = store.getDailyStats()['2026-08-16']
  assert.equal(day.answered, 2)
  assert.equal(day.correct, 1)
  assert.equal(day.lessons, 1)
  assert.equal(day.xp, 12)
})

test('Workerは日別成績を保持し、不正なキーと値を除去する', () => {
  const sanitized = sanitizeProgress({
    xp: 100,
    daily: {
      '2026-08-16': { answered: 4, correct: 3, lessons: 1, xp: 34 },
      '2026-08-17': { answered: -5, correct: 'x', lessons: 2.7, xp: 10 },
      'not-a-date': { answered: 9 },
      '2026-08-18': 'invalid',
    },
  })

  assert.deepEqual(Object.keys(sanitized.daily), ['2026-08-16', '2026-08-17'])
  assert.deepEqual(sanitized.daily['2026-08-16'], { answered: 4, correct: 3, lessons: 1, xp: 34 })
  assert.deepEqual(sanitized.daily['2026-08-17'], { answered: 0, correct: 0, lessons: 2, xp: 10 })
})

test('Workerは180日を超える日別成績を新しい順に制限する', () => {
  const daily = {}
  for (let index = 0; index < 200; index += 1) {
    daily[dateKey(new Date(2026, 0, 1 + index))] = { answered: 1, correct: 1, lessons: 0, xp: 10 }
  }
  const sanitized = sanitizeProgress({ xp: 0, daily })
  const keys = Object.keys(sanitized.daily)

  assert.equal(keys.length, 180)
  assert.equal(keys[keys.length - 1], dateKey(new Date(2026, 0, 200)))
})
