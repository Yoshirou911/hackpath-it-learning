import assert from 'node:assert/strict'
import test from 'node:test'

import { studyModules } from '../src/data/content.js'
import { glossary } from '../src/data/glossary.js'
import { questions } from '../src/data/questions.js'
import { feExamBlueprint, feIntensiveGlossary, feIntensiveLessons, feIntensiveQuestions } from '../src/data/feIntensiveCourse.js'

test('基本情報を36教材・120問・100用語へ強化する', () => {
  assert.equal(feIntensiveLessons.length, 26)
  assert.equal(feIntensiveQuestions.length, 86)
  assert.equal(feIntensiveGlossary.length, 72)
  assert.equal(studyModules.fe.lessons.length, 36)
  assert.equal(questions.filter((question) => question.topic === 'fe').length, 120)
  assert.equal(glossary.fe.length, 100)
})

test('現行試験仕様と科目A・B別の問題数を保持する', () => {
  assert.equal(feExamBlueprint.syllabusVersion, '9.2')
  assert.deepEqual(feExamBlueprint.sections.map(({ questions, minutes }) => [questions, minutes]), [[60, 90], [20, 100]])
  assert.equal(feIntensiveQuestions.filter((question) => question.examSection === 'A').length, 66)
  assert.equal(feIntensiveQuestions.filter((question) => question.examSection === 'B').length, 20)
})

test('全追加問題が4択・有効な正解・解説を持つ', () => {
  feIntensiveQuestions.forEach((question) => {
    assert.equal(question.choices.length, 4, question.id)
    assert.ok(question.answer >= 0 && question.answer < 4, question.id)
    assert.ok(question.explanation.length >= 8, question.id)
  })
  assert.equal(new Set(feIntensiveQuestions.map((question) => question.answer)).size, 4)
})

test('科目B問題は追跡できる擬似言語を持つ', () => {
  feIntensiveQuestions.filter((question) => question.examSection === 'B').forEach((question) => {
    assert.ok(question.pseudocode.includes('\n'), question.id)
    assert.match(question.pseudocode, /←|if|for|while|push|enqueue|function|procedure/)
  })
})

