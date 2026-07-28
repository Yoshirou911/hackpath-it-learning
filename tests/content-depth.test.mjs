import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import test from 'node:test'

import {
  skillCourseModules,
  skillCourseTopics,
  skillGlossary,
  skillQuestions,
} from '../src/data/skillCourses.js'

const foundationTopics = ['network', 'linux', 'database', 'web']

test('基盤4分野に十分なレッスン・問題・用語が揃っている', () => {
  foundationTopics.forEach((topicId) => {
    const topic = skillCourseTopics.find((item) => item.id === topicId)
    const module = skillCourseModules[topicId]
    const questions = skillQuestions.filter((item) => item.topic === topicId)
    const terms = skillGlossary[topicId]

    assert.equal(topic.lessons, 10, `${topicId}: ロードマップのレッスン数`)
    assert.equal(module.lessons.length, 10, `${topicId}: 実際のレッスン数`)
    assert.equal(questions.length, 20, `${topicId}: 問題数`)
    assert.equal(terms.length, 18, `${topicId}: 用語数`)
  })
})

test('追加教材には図解・実践課題・失敗例が含まれる', () => {
  foundationTopics.forEach((topicId) => {
    skillCourseModules[topicId].lessons.slice(3).forEach((lesson) => {
      assert.match(lesson.content, /concept-diagram/, `${topicId}/${lesson.id}: 図解`)
      assert.match(lesson.content, /practice-card/, `${topicId}/${lesson.id}: 実践課題`)
      assert.match(lesson.content, /pitfall-card/, `${topicId}/${lesson.id}: 失敗例`)
    })
  })
})

test('教材IDに重複がなく、全体図の画像が存在する', () => {
  const questionIds = skillQuestions.map((question) => question.id)
  assert.equal(new Set(questionIds).size, questionIds.length)

  Object.values(skillCourseModules).forEach((module) => {
    const lessonIds = module.lessons.map((lesson) => lesson.id)
    assert.equal(new Set(lessonIds).size, lessonIds.length, module.title)
  })

  assert.equal(existsSync(new URL('../public/foundations-map.png', import.meta.url)), true)
})
