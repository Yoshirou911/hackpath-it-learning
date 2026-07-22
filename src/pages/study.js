import { getStudyModule } from '../data/content.js'
import { getTopicById } from '../data/topics.js'
import { getCourseRank, getLessonRank, getStageLayout } from '../data/ranks.js'
import { renderRankBadge, renderRankEmblem } from '../components/rank.js'
import { getTopicProgress, completeLesson } from '../store.js'

export function renderStudy(path, params) {
  const topicId = params[0]
  const lessonId = params[1]
  const module = getStudyModule(topicId)
  const topic = getTopicById(topicId)

  if (!module || !topic) {
    return `<div class="page-header"><h1>トピックが見つかりません</h1></div><a href="#/roadmap" class="btn btn-secondary" data-nav="/roadmap">ロードマップに戻る</a>`
  }

  const progress = getTopicProgress(topicId, module.lessons.length)
  const isLessonCompleted = createLessonCompletionChecker(module.lessons, progress)
  const stages = getStageLayout(module.lessons.length).filter((stage) => stage.size > 0)
  const currentRank = getCourseRank(progress.completed, progress.total)

  if (!lessonId) {
    return renderLessonList({ topicId, topic, module, progress, stages, currentRank, isLessonCompleted })
  }

  const lessonIndex = module.lessons.findIndex((lesson) => lesson.id === lessonId)
  const lesson = module.lessons[lessonIndex]
  if (!lesson) {
    return `<div class="page-header"><h1>レッスンが見つかりません</h1></div><a href="#/study/${topicId}" class="btn btn-secondary" data-nav="/study/${topicId}">トピックに戻る</a>`
  }

  const lessonRank = getLessonRank(lessonIndex, module.lessons.length)
  const isUnlocked = isStageUnlocked(lessonRank, isLessonCompleted)
  if (!isUnlocked) {
    return `
      <div class="rank-locked-view rank-surface-${lessonRank.id}">
        ${renderRankEmblem(lessonRank)}
        <span class="eyebrow">RANK LOCKED</span>
        <h1>${lessonRank.label}ランクはロック中</h1>
        <p>前のランクのレッスンをすべて完了すると、${lessonRank.stage}ステージが解放されます。</p>
        <a href="#/study/${topicId}" class="btn btn-primary" data-nav="/study/${topicId}">ランク進捗へ戻る</a>
      </div>
    `
  }

  const prevLesson = lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1] : null

  return `
    <div class="page-header lesson-rank-header">
      <a href="#/study/${topicId}" class="btn btn-ghost" data-nav="/study/${topicId}">← ${topic.title}に戻る</a>
      <div class="lesson-rank-title">
        ${renderRankBadge(lessonRank)}
        <div><span class="eyebrow">MISSION ${String(lessonIndex + 1).padStart(2, '0')}</span><h1>${lesson.title}</h1></div>
      </div>
    </div>

    <div class="lesson-content rank-lesson-content rank-surface-${lessonRank.id}">
      <div class="glass-card"><div class="lesson-content-body">${lesson.content}</div></div>
      <div class="quiz-nav rank-lesson-nav">
        ${prevLesson ? `<a href="#/study/${topicId}/${prevLesson.id}" class="btn btn-secondary" data-nav="/study/${topicId}/${prevLesson.id}">← 前のレッスン</a>` : '<div></div>'}
        <button class="btn btn-primary" id="complete-lesson" data-topic="${topicId}" data-total="${module.lessons.length}" data-lesson="${lessonId}">
          ${isLessonCompleted(lessonIndex) ? '✅ 完了済み' : 'ランクXPを獲得する'}
        </button>
        ${nextLesson ? `<a href="#/study/${topicId}/${nextLesson.id}" class="btn btn-secondary" data-nav="/study/${topicId}/${nextLesson.id}">次のレッスン →</a>` : '<div></div>'}
      </div>
    </div>
  `
}

function renderLessonList({ topicId, topic, module, progress, stages, currentRank, isLessonCompleted }) {
  return `
    <div class="page-header course-rank-header">
      <span class="eyebrow">RANKED LEARNING PATH</span>
      <h1>${topic.title}</h1>
      <p class="page-subtitle">${topic.subtitle}</p>
    </div>

    <section class="course-rank-summary rank-surface-${currentRank.id}">
      ${renderRankEmblem(currentRank)}
      <div class="course-rank-summary-copy">
        <span class="eyebrow">CURRENT COURSE RANK</span>
        <h2>${currentRank.name} <small>${currentRank.stage}</small></h2>
        <p>${progress.completed}/${progress.total} ミッション完了</p>
        <div class="rank-meter"><span style="width: ${progress.pct}%"></span></div>
      </div>
      <strong class="course-progress-number">${progress.pct}%</strong>
    </section>

    <div class="rank-stage-list">
      ${stages.map((stage) => renderStage({ stage, topicId, module, isLessonCompleted })).join('')}
    </div>
  `
}

function renderStage({ stage, topicId, module, isLessonCompleted }) {
  const unlocked = isStageUnlocked(stage, isLessonCompleted)
  const lessons = module.lessons.slice(stage.start, stage.end)
  const completedCount = lessons.filter((_, offset) => isLessonCompleted(stage.start + offset)).length
  const complete = completedCount === lessons.length

  return `
    <section class="rank-stage rank-surface-${stage.id} ${unlocked ? 'is-unlocked' : 'is-locked'} ${complete ? 'is-complete' : ''}">
      <div class="rank-stage-header">
        ${renderRankBadge(stage, { completed: complete })}
        <div class="rank-stage-copy"><h2>${stage.stage}ステージ</h2><p>${stage.tagline}</p></div>
        <div class="rank-stage-status">${unlocked ? `${completedCount}/${lessons.length} COMPLETE` : 'LOCKED'}</div>
      </div>
      <div class="rank-stage-lessons">
        ${lessons.map((lesson, offset) => {
          const index = stage.start + offset
          const completed = isLessonCompleted(index)
          return `
            <div class="rank-lesson-row ${completed ? 'is-complete' : ''}">
              <span class="rank-lesson-number">${String(index + 1).padStart(2, '0')}</span>
              <span class="rank-lesson-state">${completed ? '✓' : unlocked ? '◆' : '⌁'}</span>
              <div><h3>${lesson.title}</h3><p>${stage.name} MISSION</p></div>
              ${unlocked
                ? `<a href="#/study/${topicId}/${lesson.id}" class="btn ${completed ? 'btn-secondary' : 'btn-primary'}" data-nav="/study/${topicId}/${lesson.id}">${completed ? '復習' : '開始'} →</a>`
                : '<span class="rank-lock-label">RANK LOCK</span>'}
            </div>
          `
        }).join('')}
      </div>
    </section>
  `
}

function createLessonCompletionChecker(lessons, progress) {
  const tracked = new Set(progress.completedLessonIds || [])
  const legacyCompleted = Math.max(0, progress.completed - tracked.size)
  return (index) => tracked.has(lessons[index]?.id) || index < legacyCompleted
}

function isStageUnlocked(stage, isLessonCompleted) {
  if (stage.index === 0) return true
  for (let index = 0; index < stage.start; index += 1) {
    if (!isLessonCompleted(index)) return false
  }
  return true
}

export function bindStudyEvents(container) {
  const completeBtn = container.querySelector('#complete-lesson')
  if (!completeBtn) return

  completeBtn.addEventListener('click', () => {
    completeLesson(
      completeBtn.dataset.topic,
      Number.parseInt(completeBtn.dataset.total, 10),
      completeBtn.dataset.lesson,
    )
    completeBtn.textContent = '✅ ミッション完了！'
    completeBtn.disabled = true
    completeBtn.style.opacity = '0.7'
  })
}
