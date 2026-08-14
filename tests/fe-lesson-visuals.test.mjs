import assert from 'node:assert/strict'
import test from 'node:test'

import { studyModules } from '../src/data/content.js'
import { FE_LESSON_VISUALS, renderFeLessonVisual } from '../src/components/feLessonVisual.js'

test('基本情報36レッスンすべてに内容固有の図解を用意する', () => {
  const lessons = studyModules.fe.lessons
  assert.equal(lessons.length, 36)
  assert.deepEqual(Object.keys(FE_LESSON_VISUALS).sort(), lessons.map((lesson) => lesson.id).sort())
  lessons.forEach((lesson) => {
    const spec = FE_LESSON_VISUALS[lesson.id]
    assert.ok(spec.title.length >= 8, lesson.id)
    assert.ok(spec.caption.length >= 20, lesson.id)
    assert.ok(spec.items.length >= 3, lesson.id)
    assert.equal(new Set(spec.items).size, spec.items.length, lesson.id)
  })
})

test('図解は見出し・視覚ノード・読み方を持つ', () => {
  const html = renderFeLessonVisual('fe-intensive-l03')
  assert.match(html, /<figure class="fe-lesson-visual fe-visual-flow"/)
  assert.match(html, /CPUの命令サイクル/)
  assert.equal((html.match(/class="fe-visual-node"/g) || []).length, 4)
  assert.match(html, /図の読み方/)
  assert.match(html, /role="img"/)
})

test('存在しないレッスンには図解を挿入しない', () => {
  assert.equal(renderFeLessonVisual('custom-note'), '')
})
