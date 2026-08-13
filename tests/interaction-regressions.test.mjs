import assert from 'node:assert/strict'
import test from 'node:test'

import { roadmapTopics } from '../src/data/topics.js'

function installBrowserGlobals() {
  const values = new Map()
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  }
  globalThis.window = globalThis
  globalThis.window.addEventListener = () => {}
  globalThis.document = { addEventListener() {}, visibilityState: 'visible' }
}

test('問題フィルターのURLは全分野でも有効なルートになる', async () => {
  installBrowserGlobals()
  const { getQuizPath } = await import('../src/pages/quiz.js?quiz-path-regression')

  assert.equal(getQuizPath('', 'weak', 'gold'), '/quiz/all/weak/gold')
  assert.equal(getQuizPath('fe', 'section-b', 'all'), '/quiz/fe/section-b/all')
})

test('クイズ選択肢はキーボード操作でき、問題がないランクは無効になる', async () => {
  installBrowserGlobals()
  const { renderQuiz } = await import('../src/pages/quiz.js?quiz-accessibility-regression')
  const html = renderQuiz('/quiz/fe', ['fe'])

  assert.match(html, /role="radiogroup"/)
  assert.match(html, /role="radio"/)
  assert.match(html, /data-rank-filter="sovereign" disabled/)
  assert.doesNotMatch(html.match(/id="sound-toggle"[^>]+>/)?.[0] || '', /data-mode=/)
})

test('ノート追加先には利用可能な全コースが自動で並ぶ', async () => {
  installBrowserGlobals()
  const { editorTopics } = await import('../src/pages/editor.js?editor-topics-regression')
  const availableIds = roadmapTopics.filter((topic) => topic.status === 'available').map((topic) => topic.id)
  const editorIds = editorTopics.filter((topic) => topic.id !== 'custom').map((topic) => topic.id)

  assert.deepEqual(editorIds.sort(), availableIds.sort())
})
