import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { labExercises, labLevelLabels, getLabExercise } from '../src/data/labExercises.js'
import { roadmapTopics } from '../src/data/topics.js'

test('課題は一意のIDと必要な項目をすべて持つ', () => {
  const ids = labExercises.map((exercise) => exercise.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(labExercises.length >= 6)

  labExercises.forEach((exercise) => {
    assert.match(exercise.id, /^lab-[a-z0-9-]+$/)
    assert.ok(exercise.title.length > 0)
    assert.ok(labLevelLabels[exercise.level], `${exercise.id}のレベルは既定の3段階`)
    assert.ok(exercise.brief.length >= 10)
    assert.ok(exercise.requirement.length >= 20)
    assert.match(exercise.functionName, /^[a-zA-Z][a-zA-Z0-9]*$/)
    assert.ok(exercise.starterCode.includes(exercise.functionName))
    assert.ok(exercise.hints.length >= 1)
    assert.ok(exercise.tags.length >= 1)
    assert.ok(exercise.cases.length >= 3, `${exercise.id}は3件以上のテストケースを持つ`)
    assert.equal(getLabExercise(exercise.id), exercise)
  })
})

test('関連コースは実在する利用可能コースを指す', () => {
  const available = new Set(roadmapTopics.filter((topic) => topic.status !== 'locked').map((topic) => topic.id))
  labExercises.filter((exercise) => exercise.topicId).forEach((exercise) => {
    assert.ok(available.has(exercise.topicId), `${exercise.id}の関連コース${exercise.topicId}が存在する`)
  })
})

test('模範解答はすべてのテストケースを通過する', () => {
  labExercises.forEach((exercise) => {
    const factory = new Function(`"use strict";\n${exercise.solution}\n;return ${exercise.functionName};`)
    const target = factory()
    assert.equal(typeof target, 'function', `${exercise.id}の解答は関数を定義する`)

    exercise.cases.forEach((testCase) => {
      const actual = target(...structuredClone(testCase.args))
      assert.deepEqual(actual, testCase.expected, `${exercise.id} / ${testCase.label}`)
    })
  })
})

test('初期コードは判定を通過しない（課題として成立している）', () => {
  labExercises.forEach((exercise) => {
    const factory = new Function(`"use strict";\n${exercise.starterCode}\n;return ${exercise.functionName};`)
    const target = factory()
    const allPassed = exercise.cases.every((testCase) => {
      try {
        return JSON.stringify(target(...structuredClone(testCase.args))) === JSON.stringify(testCase.expected)
      } catch {
        return false
      }
    })
    assert.equal(allPassed, false, `${exercise.id}の初期コードは未完成である`)
  })
})

test('テストケースの入出力は構造化複製できる値だけを使う', () => {
  labExercises.forEach((exercise) => {
    exercise.cases.forEach((testCase) => {
      assert.ok(Array.isArray(testCase.args), `${exercise.id}の引数は配列`)
      assert.doesNotThrow(() => structuredClone({ args: testCase.args, expected: testCase.expected }))
      assert.ok(testCase.label.length > 0)
    })
  })
})

test('実行Workerは通信系グローバルを無効化してから利用者コードを評価する', () => {
  const runner = readFileSync(new URL('../public/lab-runner.js', import.meta.url), 'utf8')

  ;['fetch', 'XMLHttpRequest', 'importScripts', 'indexedDB', 'caches', 'WebSocket'].forEach((name) => {
    assert.match(runner, new RegExp(`'${name}'`), `${name}を無効化対象に含める`)
  })
  // 無効化はコードを評価する前に実行する必要がある。
  assert.ok(runner.indexOf('BLOCKED_GLOBALS.forEach') < runner.indexOf('new Function'))
})

test('実行Workerだけにunsafe-evalを許可し、画面本体のCSPは変更しない', () => {
  const headers = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8')
  const workerCode = readFileSync(new URL('../worker/index.js', import.meta.url), 'utf8')
  const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

  // 静的ヘッダーは、後に定義した規則が勝つため /lab-runner.js を /* より後へ置く。
  assert.ok(headers.indexOf('/lab-runner.js') > headers.indexOf('/*'))
  assert.match(headers, /\/lab-runner\.js[\s\S]*script-src 'self' 'unsafe-eval'/)

  // 全体向けの`/*`規則はunsafe-evalを含めない。
  const wildcardPolicy = headers
    .split(/^\/lab-runner\.js$/m)[0]
    .split('\n')
    .find((line) => line.includes('Content-Security-Policy'))
  assert.ok(wildcardPolicy)
  assert.doesNotMatch(wildcardPolicy, /unsafe-eval/)

  assert.match(workerCode, /isLabRunner \? "script-src 'self' 'unsafe-eval'" : "script-src 'self'"/)
  assert.doesNotMatch(indexHtml, /unsafe-eval/)
})
