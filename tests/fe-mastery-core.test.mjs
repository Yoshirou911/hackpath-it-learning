import assert from 'node:assert/strict'
import test from 'node:test'

import { questions } from '../src/data/questions.js'
import {
  FE_MASTERY_DOMAINS,
  getFeMasteryDomainId,
  getFeMasterySnapshot,
  renderFeMasteryCore,
} from '../src/components/feMasteryCore.js'

test('基本情報140問を8つの理解度分野へ重複なく分類する', () => {
  const feQuestions = questions.filter((question) => question.topic === 'fe')
  const validDomains = new Set(FE_MASTERY_DOMAINS.map((domain) => domain.id))
  assert.equal(feQuestions.length, 140)
  feQuestions.forEach((question) => assert.ok(validDomains.has(getFeMasteryDomainId(question)), String(question.id)))
  FE_MASTERY_DOMAINS.forEach((domain) => {
    assert.ok(feQuestions.some((question) => getFeMasteryDomainId(question) === domain.id), domain.id)
  })
})

test('理解度は正答率60%と回答網羅率40%から計算する', () => {
  const sample = [
    { id: 't1', topic: 'fe', category: '基礎理論', level: 'beginner' },
    { id: 't2', topic: 'fe', category: '基礎理論', level: 'beginner' },
    { id: 'a1', topic: 'fe', examSection: 'B', bDomain: 'algorithm', level: 'intermediate' },
    { id: 's1', topic: 'fe', examSection: 'B', bDomain: 'security', level: 'advanced' },
  ]
  const snapshot = getFeMasterySnapshot(sample, { t1: true, t2: false, s1: true })
  const theoryBronze = snapshot.domains.find((domain) => domain.id === 'theory-ai').levels.find((level) => level.id === 'bronze')
  assert.deepEqual(
    { total: theoryBronze.total, answered: theoryBronze.answered, correct: theoryBronze.correct, coverage: theoryBronze.coverage, accuracy: theoryBronze.accuracy, mastery: theoryBronze.mastery },
    { total: 2, answered: 2, correct: 1, coverage: 100, accuracy: 50, mastery: 70 },
  )
  assert.equal(snapshot.mastery, 70)
})

test('理解度コアは8分野・3レベルと次の演習導線を表示する', () => {
  const feQuestions = questions.filter((question) => question.topic === 'fe')
  const html = renderFeMasteryCore(feQuestions, {})
  assert.equal((html.match(/data-mastery-domain=/g) || []).length, 8)
  assert.equal((html.match(/data-mastery-panel=/g) || []).length, 8)
  assert.match(html, /BRONZE · 基礎/)
  assert.match(html, /SILVER · 応用/)
  assert.match(html, /GOLD · 上級/)
  assert.match(html, /理解度 = 正答率60% \+ 回答網羅率40%/)
  assert.match(html, /#\/quiz\/fe\/unanswered\//)
  assert.doesNotMatch(html, /<svg/)
})
