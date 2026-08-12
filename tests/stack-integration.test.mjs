import assert from 'node:assert/strict'
import test from 'node:test'

import { stackModule, stackQuestions, stackTopic } from '../src/data/stackCourse.js'
import { studyModules } from '../src/data/content.js'
import { questions } from '../src/data/questions.js'
import { roadmapTopics } from '../src/data/topics.js'

test('STACKの詳しい教本と科目A/B問題がHackPathへ統合される', () => {
  assert.equal(stackTopic.lessons, 83)
  assert.equal(stackModule.lessons.length, 83)
  assert.equal(stackQuestions.length, 99)
  assert.equal(stackQuestions.filter((question) => question.subject === '科目A').length, 95)
  assert.equal(stackQuestions.filter((question) => question.subject === '科目B').length, 4)
  assert.equal(studyModules.stack, stackModule)
  assert.ok(roadmapTopics.some((topic) => topic.id === 'stack'))
  assert.ok(questions.some((question) => question.id === 'stack-b-1'))
})

test('科目B問題にはコードと入力式の正解が揃っている', () => {
  stackQuestions.filter((question) => question.subject === '科目B').forEach((question) => {
    assert.equal(question.inputType, 'text')
    assert.ok(question.pseudocode.length > 20)
    assert.ok(question.expectedAnswer.length > 0)
    assert.ok(question.explanation.length > 20)
  })
})

test('移植した教本は詳しい本文と安全化されたHTMLを持つ', () => {
  stackModule.lessons.forEach((lesson) => {
    assert.match(lesson.content, /stack-textbook-content/)
    assert.match(lesson.content, /<h2>|<h3>/)
    assert.doesNotMatch(lesson.content, /<script|onerror\s*=/i)
  })
})

test('全問題と全レッスンのIDは統合後も重複しない', () => {
  const questionIds = questions.map((question) => String(question.id))
  assert.equal(new Set(questionIds).size, questionIds.length)

  Object.values(studyModules).forEach((module) => {
    const lessonIds = module.lessons.map((lesson) => lesson.id)
    assert.equal(new Set(lessonIds).size, lessonIds.length, module.title)
  })
})
