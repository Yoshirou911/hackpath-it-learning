import assert from 'node:assert/strict'
import test from 'node:test'

import { studyModules } from '../src/data/content.js'
import { glossary } from '../src/data/glossary.js'
import { questions } from '../src/data/questions.js'
import { feExamBlueprint, feIntensiveGlossary, feIntensiveLessons, feIntensiveQuestions } from '../src/data/feIntensiveCourse.js'
import { feMockSpecs, getFeMockQuestions } from '../src/data/feMockExam.js'

test('基本情報を36教材・140問・100用語へ強化する', () => {
  assert.equal(feIntensiveLessons.length, 26)
  assert.equal(feIntensiveQuestions.length, 106)
  assert.equal(feIntensiveGlossary.length, 72)
  assert.equal(studyModules.fe.lessons.length, 36)
  assert.equal(questions.filter((question) => question.topic === 'fe').length, 140)
  assert.equal(glossary.fe.length, 100)
})

test('現行試験仕様と科目A・B別の問題数を保持する', () => {
  assert.equal(feExamBlueprint.syllabusVersion, '9.2')
  assert.deepEqual(feExamBlueprint.sections.map(({ questions, minutes }) => [questions, minutes]), [[60, 90], [20, 100]])
  assert.equal(feIntensiveQuestions.filter((question) => question.examSection === 'A').length, 66)
  assert.equal(feIntensiveQuestions.filter((question) => question.examSection === 'B').length, 40)
})

test('科目A模試と科目B模試2セットが本番の問題数・構成を再現する', () => {
  const feQuestions = questions.filter((question) => question.topic === 'fe')
  assert.equal(getFeMockQuestions(feQuestions, 'mock-a').length, 60)
  const bSets = ['mock-b-1', 'mock-b-2'].map((mode) => getFeMockQuestions(feQuestions, mode))
  bSets.forEach((set) => {
    assert.equal(set.length, 20)
    assert.equal(set.filter((question) => question.bDomain === 'algorithm').length, 16)
    assert.equal(set.filter((question) => question.bDomain === 'security').length, 4)
  })
  assert.equal(new Set([...feMockSpecs['mock-b-1'].ids, ...feMockSpecs['mock-b-2'].ids]).size, 40)
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
