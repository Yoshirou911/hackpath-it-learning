import assert from 'node:assert/strict'
import test from 'node:test'

import { expandedCertificationGlossary, expandedCertificationModules, expandedCertificationQuestions, expandedCertificationTopics } from '../src/data/certificationExpansion.js'
import { roadmapTopics } from '../src/data/topics.js'
import { studyModules } from '../src/data/content.js'

const ids = ['sg', 'sc', 'nwsp', 'dbsp', 'pmcert', 'st', 'awsclf', 'ccna', 'linuc1']

test('国家・ベンダー資格9コースを追加する', () => {
  assert.deepEqual(expandedCertificationTopics.map((topic) => topic.id), ids)
  ids.forEach((id) => {
    assert.equal(expandedCertificationModules[id].lessons.length, 8)
    assert.equal(expandedCertificationQuestions.filter((question) => question.topic === id).length, 12)
    assert.equal(expandedCertificationGlossary[id].length, 10)
    assert.equal(studyModules[id], expandedCertificationModules[id])
    assert.ok(roadmapTopics.some((topic) => topic.id === id && topic.category === 'certification'))
  })
})

test('追加資格教材は非公式表記と段階学習を持つ', () => {
  Object.values(expandedCertificationModules).flatMap((module) => module.lessons).forEach((lesson) => {
    assert.match(lesson.content, /非公式の独自教材/)
    assert.match(lesson.content, /concept-diagram/)
    assert.match(lesson.content, /試験対策ミッション/)
  })
})

test('資格問題の正解位置は固定されていない', () => {
  ids.forEach((id) => {
    const answers = expandedCertificationQuestions.filter((question) => question.topic === id).map((question) => question.answer)
    assert.ok(new Set(answers).size >= 4, id)
  })
})
