import { getStudyModule } from '../data/content.js'
import { getTopicById } from '../data/topics.js'
import { getCourseRank, getLessonRank, getStageLayout } from '../data/ranks.js'
import { renderRankBadge, renderRankEmblem } from '../components/rank.js'
import { renderExplainedLesson } from '../components/lessonExplainer.js'
import { getTopicQuizProgress, getCustomLessons } from '../store.js'
import { renderContent } from './editor.js'

export function renderStudy(path, params) {
  const topicId = params[0]
  const lessonId = params[1]
  const module = getStudyModule(topicId)
  const topic = getTopicById(topicId)

  if (!module || !topic) {
    return `<div class="page-header"><h1>トピックが見つかりません</h1></div><a href="#/roadmap" class="btn btn-secondary" data-nav="/roadmap">ロードマップに戻る</a>`
  }

  const progress = getTopicQuizProgress(topicId)

  // カスタムレッスン（ユーザーが追加したノート）をマージ
  const customLessons = getCustomLessons().filter(
    l => l.topicId === topicId || (topicId === 'itp' && l.topicId === 'custom')
  )
  const mergedModule = customLessons.length > 0 ? {
    ...module,
    lessons: [
      ...module.lessons,
      ...customLessons.map(l => ({
        id: l.id,
        title: '📝 ' + escapeHtml(l.title),
        content: renderContent(l.content),
        isCustom: true,
      }))
    ]
  } : module
  const stages = getStageLayout(mergedModule.lessons.length).filter((stage) => stage.size > 0)
  const currentRank = getCourseRank(progress.completed, progress.total)

  if (!lessonId) {
    return renderLessonList({ topicId, topic, module: mergedModule, progress, stages, currentRank })
  }

  const lessonIndex = mergedModule.lessons.findIndex((lesson) => lesson.id === lessonId)
  const lesson = mergedModule.lessons[lessonIndex]
  if (!lesson) {
    return `<div class="page-header"><h1>レッスンが見つかりません</h1></div><a href="#/study/${topicId}" class="btn btn-secondary" data-nav="/study/${topicId}">トピックに戻る</a>`
  }

  const lessonRank = getLessonRank(lessonIndex, mergedModule.lessons.length)
  const prevLesson = lessonIndex > 0 ? mergedModule.lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < mergedModule.lessons.length - 1 ? mergedModule.lessons[lessonIndex + 1] : null
  const explainedContent = renderExplainedLesson(lesson.content, {
    topicId,
    lessonTitle: lesson.title,
    isCustom: lesson.isCustom,
  })

  return `
    <div class="page-header lesson-rank-header">
      <a href="#/study/${topicId}" class="btn btn-ghost" data-nav="/study/${topicId}">← ${topic.title}に戻る</a>
      <div class="lesson-rank-title">
        ${renderRankBadge(lessonRank)}
        <div><span class="eyebrow">LESSON ${String(lessonIndex + 1).padStart(2, '0')}</span><h1>${lesson.title}</h1></div>
      </div>
    </div>

    <div class="lesson-content rank-lesson-content rank-surface-${lessonRank.id}">
      <div class="glass-card"><div class="lesson-content-body">${explainedContent}</div></div>

      <!-- 読むだけモード：XPなし・問題演習への誘導のみ -->
      <div class="glass-card" style="margin-top:16px; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; background: rgba(108,71,255,0.08); border: 1px solid rgba(108,71,255,0.25);">
        <div>
          <p style="font-size:13px; opacity:0.7; margin:0 0 4px;">📖 読むだけモード — XPは問題を解いて獲得できます</p>
          <p style="font-size:12px; opacity:0.5; margin:0;">このレッスンの内容が出題される問題に挑戦してみよう！</p>
        </div>
        <a href="#/quiz/${topicId}" class="btn btn-primary" data-nav="/quiz/${topicId}" style="white-space:nowrap;">
          ⚡ ${topic.title}の問題を解く
        </a>
      </div>

      <div class="quiz-nav rank-lesson-nav">
        ${prevLesson
          ? `<a href="#/study/${topicId}/${prevLesson.id}" class="btn btn-secondary" data-nav="/study/${topicId}/${prevLesson.id}">← 前のレッスン</a>`
          : '<div></div>'}
        ${nextLesson
          ? `<a href="#/study/${topicId}/${nextLesson.id}" class="btn btn-primary" data-nav="/study/${topicId}/${nextLesson.id}">次のレッスン →</a>`
          : `<a href="#/study/${topicId}" class="btn btn-secondary" data-nav="/study/${topicId}">📋 レッスン一覧へ</a>`}
      </div>
    </div>
  `
}

function renderLessonList({ topicId, topic, module, progress, stages, currentRank }) {
  return `
    <div class="page-header course-rank-header">
      <span class="eyebrow">LEARNING PATH</span>
      <h1>${topic.title}</h1>
      <p class="page-subtitle">${topic.subtitle}</p>
    </div>

    <section class="course-rank-summary rank-surface-${currentRank.id}">
      ${renderRankEmblem(currentRank)}
      <div class="course-rank-summary-copy">
        <span class="eyebrow">CURRENT COURSE RANK</span>
        <h2>${currentRank.name} <small>${currentRank.stage}</small></h2>
        <p>クイズ正解 ${progress.completed}/${progress.total}</p>
        <div class="rank-meter"><span style="width: ${progress.pct}%"></span></div>
      </div>
      <strong class="course-progress-number">${progress.pct}%</strong>
    </section>

    <div class="glass-card" style="margin-bottom:20px; padding:14px 18px; display:flex; align-items:center; gap:12px; background:rgba(0,255,136,0.06); border:1px solid rgba(0,255,136,0.2);">
      <span style="font-size:22px;">💡</span>
      <div>
        <p style="font-weight:600; margin:0 0 2px; font-size:14px;">読むだけはXPなし・全レッスン自由に読めます</p>
        <p style="font-size:12px; opacity:0.65; margin:0;">⚡ 問題に回答するとXPを獲得。正解するとより多く獲得できます</p>
      </div>
      <a href="#/quiz/${topicId}" class="btn btn-primary" data-nav="/quiz/${topicId}" style="margin-left:auto; white-space:nowrap; flex-shrink:0;">
        問題を解く →
      </a>
    </div>

    <div class="rank-stage-list">
      ${stages.map((stage) => renderStage({ stage, topicId, module })).join('')}
    </div>
  `
}

function renderStage({ stage, topicId, module }) {
  const lessons = module.lessons.slice(stage.start, stage.end)

  return `
    <section class="rank-stage rank-surface-${stage.id} is-unlocked">
      <div class="rank-stage-header">
        ${renderRankBadge(stage, { completed: false })}
        <div class="rank-stage-copy"><h2>${stage.stage}ステージ</h2><p>${stage.tagline}</p></div>
        <div class="rank-stage-status">${lessons.length} LESSONS</div>
      </div>
      <div class="rank-stage-lessons">
        ${lessons.map((lesson, offset) => {
          const index = stage.start + offset
          return `
            <div class="rank-lesson-row">
              <span class="rank-lesson-number">${String(index + 1).padStart(2, '0')}</span>
              <span class="rank-lesson-state">◆</span>
              <div><h3>${lesson.title}</h3><p>${stage.name} LESSON</p></div>
              <a href="#/study/${topicId}/${lesson.id}" class="btn btn-secondary" data-nav="/study/${topicId}/${lesson.id}">読む →</a>
            </div>
          `
        }).join('')}
      </div>
    </section>
  `
}

export function bindStudyEvents(container) {
  // 読むだけモードのため、completeLesson処理は不要
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character])
}
