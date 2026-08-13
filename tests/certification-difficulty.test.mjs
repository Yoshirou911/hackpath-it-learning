import assert from 'node:assert/strict'
import test from 'node:test'

import { certificationDifficultyRanking, certificationDifficultyRubric } from '../src/data/certificationDifficulty.js'
import { roadmapTopics } from '../src/data/topics.js'

test('資格難易度ランキングは実在資格12件を重複なく比較する', () => {
  const ids = certificationDifficultyRanking.map((entry) => entry.topicId)
  assert.equal(ids.length, 12)
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(!ids.includes('sec'), '単一資格ではないセキュリティコースは除外する')
  ids.forEach((id) => assert.ok(roadmapTopics.some((topic) => topic.id === id && topic.status === 'available'), id))
})

test('難易度スコアは共通ルーブリックの合計で降順になる', () => {
  certificationDifficultyRanking.forEach((entry, index) => {
    const total = certificationDifficultyRubric.reduce((sum, item) => {
      assert.ok(entry.breakdown[item.id] >= 0 && entry.breakdown[item.id] <= item.max)
      return sum + entry.breakdown[item.id]
    }, 0)
    assert.equal(entry.score, total, entry.topicId)
    if (index > 0) assert.ok(certificationDifficultyRanking[index - 1].score >= entry.score)
  })
})

