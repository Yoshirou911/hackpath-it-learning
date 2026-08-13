import assert from 'node:assert/strict'
import test from 'node:test'

import { eliteGlossary, eliteModule, eliteQuestions, eliteTopic } from '../src/data/eliteCourse.js'
import { accountRanks } from '../src/data/ranks.js'
import { roadmapTopics } from '../src/data/topics.js'
import { studyModules } from '../src/data/content.js'

test('SOVEREIGN超高難度コースは最初から公開されている', () => {
  assert.equal(eliteTopic.status, 'available')
  assert.equal(eliteTopic.lessons, 10)
  assert.equal(eliteModule.lessons.length, 10)
  assert.equal(eliteQuestions.length, 20)
  assert.equal(eliteGlossary.length, 16)
  assert.ok(eliteQuestions.every((question) => question.level === 'elite' && question.difficulty === 7))
  assert.equal(studyModules.sovereign, eliteModule)
  assert.ok(roadmapTopics.some((topic) => topic.id === 'sovereign' && topic.status === 'available'))
})

test('最上位ランクSOVEREIGNはマスターの先にある', () => {
  assert.equal(accountRanks.at(-1).id, 'sovereign')
  assert.ok(accountRanks.at(-1).xpMin > accountRanks.at(-2).xpMin)
})

test('超高難度問題の正解位置は固定されていない', () => {
  assert.ok(new Set(eliteQuestions.map((question) => question.answer)).size >= 4)
})
