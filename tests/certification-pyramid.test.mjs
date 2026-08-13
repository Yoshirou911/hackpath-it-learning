import assert from 'node:assert/strict'
import test from 'node:test'

import { certificationPyramidTiers } from '../src/data/certificationPyramid.js'
import { accountRanks } from '../src/data/ranks.js'
import { roadmapTopics } from '../src/data/topics.js'

test('資格ピラミッドは7ランクを頂点から土台まで並べる', () => {
  assert.deepEqual(
    certificationPyramidTiers.map((tier) => tier.rankId),
    [...accountRanks].reverse().map((rank) => rank.id),
  )
  assert.deepEqual(certificationPyramidTiers[0].topicIds, ['sc'])
  assert.deepEqual(certificationPyramidTiers.at(-1).topicIds, ['itp'])
})

test('利用可能な資格コースを重複なくすべて配置する', () => {
  const expectedIds = roadmapTopics
    .filter((topic) => topic.category === 'certification' && topic.status === 'available')
    .map((topic) => topic.id)
    .sort()
  const pyramidIds = certificationPyramidTiers.flatMap((tier) => tier.topicIds)

  assert.equal(new Set(pyramidIds).size, pyramidIds.length)
  assert.deepEqual([...pyramidIds].sort(), expectedIds)
})

