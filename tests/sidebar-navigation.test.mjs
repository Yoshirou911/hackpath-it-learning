import assert from 'node:assert/strict'
import test from 'node:test'

import { sidebarNavGroups } from '../src/components/layout.js'
import { roadmapTopics } from '../src/data/topics.js'

test('左メニューは資格対策とITスキルを分ける', () => {
  assert.deepEqual(sidebarNavGroups.map((group) => group.id), ['certification', 'skill'])

  sidebarNavGroups.forEach((group) => {
    const expected = roadmapTopics.filter((topic) => topic.category === group.id && topic.status === 'available')
    assert.equal(group.items.length, expected.length, group.id)
    assert.ok(group.items.every((item) => item.path && item.label && item.icon), group.id)
  })
})

test('資格・ITスキルの利用可能コースを重複なく左メニューへ収録する', () => {
  const menuPaths = sidebarNavGroups.flatMap((group) => group.items.map((item) => item.path))
  const expectedPaths = roadmapTopics
    .filter((topic) => ['certification', 'skill'].includes(topic.category) && topic.status === 'available')
    .map((topic) => topic.path)

  assert.equal(new Set(menuPaths).size, menuPaths.length)
  assert.deepEqual([...menuPaths].sort(), [...expectedPaths].sort())
})

