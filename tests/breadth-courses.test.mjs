import assert from 'node:assert/strict'
import test from 'node:test'

import { breadthGlossary, breadthModules, breadthQuestions, breadthTopics } from '../src/data/skillCourseBreadthExpansion.js'
import { roadmapTopics } from '../src/data/topics.js'
import { studyModules } from '../src/data/content.js'
import { questions } from '../src/data/questions.js'

const expectedIds = ['data', 'mobile', 'iot', 'sre', 'ux', 'governance']

test('未開拓だった6分野に十分な入力教材を追加する', () => {
  assert.deepEqual(breadthTopics.map((topic) => topic.id), expectedIds)
  expectedIds.forEach((id) => {
    assert.equal(breadthModules[id].lessons.length, 8)
    assert.equal(breadthQuestions.filter((question) => question.topic === id).length, 8)
    assert.equal(breadthGlossary[id].length, 10)
    assert.equal(studyModules[id], breadthModules[id])
    assert.ok(roadmapTopics.some((topic) => topic.id === id))
  })
})

test('追加教材は説明・図解・実践・失敗例・理解チェックを持つ', () => {
  Object.values(breadthModules).flatMap((module) => module.lessons).forEach((lesson) => {
    assert.match(lesson.content, /lesson-lead/)
    assert.match(lesson.content, /concept-diagram/)
    assert.match(lesson.content, /practice-card/)
    assert.match(lesson.content, /pitfall-card/)
    assert.match(lesson.content, /理解チェック/)
  })
})

test('統合後も教材と問題のIDが重複しない', () => {
  assert.equal(new Set(questions.map((question) => String(question.id))).size, questions.length)
  Object.values(studyModules).forEach((module) => {
    const ids = module.lessons.map((lesson) => lesson.id)
    assert.equal(new Set(ids).size, ids.length, module.id)
  })
})
