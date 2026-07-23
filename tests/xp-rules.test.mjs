import assert from 'node:assert/strict'
import test from 'node:test'

function installStorage() {
  const values = new Map()
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  }
  globalThis.window = globalThis
  globalThis.document = { addEventListener() {}, visibilityState: 'visible' }
}

test('閲覧・用語確認ではXPが増えず、問題回答だけでXPを獲得する', async () => {
  installStorage()
  const store = await import('../src/store.js?xp-rules')

  store.completeLesson('itp', 10, 'itp-l1')
  store.markFlashcardKnown('term-1')
  assert.equal(store.getState().xp, 0)

  store.recordQuizAnswer(1, true, 'itp')
  assert.equal(store.getState().xp, 10)

  store.recordQuizAnswer(1, true, 'itp')
  assert.equal(store.getState().xp, 10)

  store.recordQuizAnswer(2, false, 'itp')
  assert.equal(store.getState().xp, 12)
})

test('数値IDの資格問題もコース進捗へ反映する', async () => {
  installStorage()
  const store = await import('../src/store.js?numeric-question-progress')

  store.recordQuizAnswer(1, true, 'itp')
  const progress = store.getTopicQuizProgress('itp')

  assert.equal(progress.completed, 1)
  assert.ok(progress.total > 1)
  assert.equal(progress.pct, Math.round(100 / progress.total))
})

test('未進行でも上級レッスンを閲覧できる', async () => {
  installStorage()
  const { renderStudy } = await import('../src/pages/study.js?all-ranks-readable')

  const html = renderStudy('/study/itp/itp-l10', ['itp', 'itp-l10'])

  assert.doesNotMatch(html, /RANK LOCKED|ランクはロック中/)
  assert.match(html, /LESSON 10/)
  assert.match(html, /問題を解く/)
})

test('追加ノートのHTMLは実行可能な要素として描画しない', async () => {
  installStorage()
  const { renderContent } = await import('../src/pages/editor.js?safe-notes')

  const html = renderContent('<img src=x onerror=alert(1)><script>alert(1)</script>')

  assert.doesNotMatch(html, /<script|<img/i)
  assert.match(html, /&lt;script&gt;/)
})
