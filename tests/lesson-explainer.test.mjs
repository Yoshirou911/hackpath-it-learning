import assert from 'node:assert/strict'
import test from 'node:test'

import { renderExplainedLesson } from '../src/components/lessonExplainer.js'
import { studyModules } from '../src/data/content.js'

test('短い用語一覧を「何か・なぜ必要か・理解チェック」付きの説明へ変換する', () => {
  const lesson = studyModules.fe.lessons.find((item) => item.id === 'fe-l3')
  const html = renderExplainedLesson(lesson.content, {
    topicId: 'fe',
    lessonTitle: lesson.title,
  })

  assert.match(html, /まず「ネットワーク」とは何か/)
  assert.match(html, /OSI参照モデル/)
  assert.match(html, /これは何？/)
  assert.match(html, /なぜ必要？/)
  assert.match(html, /理解チェック/)
  assert.match(html, /通信のどの段階を担当し/)
})

test('全コースの短い標準教材に理解ガイドを追加する', () => {
  let explainedLessonCount = 0

  Object.entries(studyModules).forEach(([topicId, module]) => {
    module.lessons.forEach((lesson) => {
      if (lesson.content.includes('lesson-lead')) return
      const html = renderExplainedLesson(lesson.content, {
        topicId,
        lessonTitle: lesson.title,
      })
      assert.match(html, /lesson-understanding-guide/, `${topicId}/${lesson.id}`)
      explainedLessonCount += 1
    })
  })

  assert.equal(explainedLessonCount, 102)
})

test('深掘り済み教材とユーザー作成ノートは二重加工しない', () => {
  const richLesson = studyModules.network.lessons.find((item) => item.id === 'network-l4')
  assert.equal(
    renderExplainedLesson(richLesson.content, {
      topicId: 'network',
      lessonTitle: richLesson.title,
    }),
    richLesson.content,
  )

  const customContent = '<p><strong>自分の用語</strong></p>'
  assert.equal(
    renderExplainedLesson(customContent, {
      topicId: 'itp',
      lessonTitle: '個人ノート',
      isCustom: true,
    }),
    customContent,
  )
})
