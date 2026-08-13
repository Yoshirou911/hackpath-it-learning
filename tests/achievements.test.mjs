import assert from 'node:assert/strict'
import test from 'node:test'

import { getAchievements } from '../src/data/achievements.js'

test('実績バッジは既存の回答履歴とXPから再計算できる', () => {
  const achievements = getAchievements({ xp: 2200, quiz: { answered: { 1: true, 2: false, 'network-1': true } } })
  assert.equal(achievements.find((item) => item.id === 'first-step').unlocked, true)
  assert.equal(achievements.find((item) => item.id === 'first-clear').unlocked, true)
  assert.equal(achievements.find((item) => item.id === 'master-rank').unlocked, true)
  assert.equal(achievements.find((item) => item.id === 'ten-clear').unlocked, false)
})

test('未達成の実績はロック状態になる', () => {
  const achievements = getAchievements({ xp: 0, quiz: { answered: {} } })
  assert.ok(achievements.every((item) => item.unlocked === false))
})
