import { getStudyModule } from '../data/content.js'
import { getQuestionsByTopic } from '../data/questions.js'
import { getTopicById } from '../data/topics.js'
import { getCourseRank, getLessonRank, getStageLayout } from '../data/ranks.js'
import { renderRankBadge, renderRankEmblem } from '../components/rank.js'
import { renderExplainedLesson } from '../components/lessonExplainer.js'
import { bindFeMasteryCore, renderFeMasteryCore } from '../components/feMasteryCore.js'
import { renderFeLessonArtwork, renderFeLessonVisual } from '../components/feLessonVisual.js'
import { getTopicQuizProgress, getCustomLessons, getState } from '../store.js'
import { renderContent } from './editor.js'
import { feExamBlueprint } from '../data/feIntensiveCourse.js'

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
      <div class="glass-card"><div class="lesson-content-body">
        ${topicId === 'fe' && !lesson.isCustom ? renderFeLessonArtwork(lesson.id) : ''}
        ${topicId === 'fe' && !lesson.isCustom ? renderFeLessonVisual(lesson.id) : ''}
        ${explainedContent}
      </div></div>

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

    ${topicId === 'fe' ? renderFeCommandCenter(module, progress) : ''}
    ${topicId === 'fe' ? renderFeMasteryCore(getQuestionsByTopic('fe'), getState().quiz.answered || {}) : ''}

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

function renderFeCommandCenter(module, progress) {
  const [sectionA, sectionB] = feExamBlueprint.sections
  const feQuestions = getQuestionsByTopic('fe')
  const answeredMap = getState().quiz.answered || {}
  const readiness = ['A', 'B'].map((section) => {
    const sectionQuestions = feQuestions.filter((question) => (question.examSection || 'A') === section)
    const answered = sectionQuestions.filter((question) => question.id in answeredMap)
    const correct = answered.filter((question) => answeredMap[question.id] === true).length
    return {
      section,
      total: sectionQuestions.length,
      answered: answered.length,
      correct,
      accuracy: answered.length ? Math.round((correct / answered.length) * 100) : 0,
      coverage: sectionQuestions.length ? Math.round((answered.length / sectionQuestions.length) * 100) : 0,
    }
  })
  const [readinessA, readinessB] = readiness
  const targetA = readinessA.coverage === 100 && readinessA.accuracy >= 75
  const targetB = readinessB.coverage === 100 && readinessB.accuracy >= 80
  return `
    <section class="fe-command-center">
      <div class="fe-command-copy">
        <span class="eyebrow">FE EXAM COMMAND CENTER</span>
        <h2>基本情報を、合格後も使える知識へ。</h2>
        <p>シラバスVer.${feExamBlueprint.syllabusVersion}を基準に、用語の意味、仕組み、計算、擬似言語のトレースまで段階的に学びます。</p>
        <div class="fe-command-actions">
          <a href="#/quiz/fe/section-a/all" class="btn btn-primary" data-nav="/quiz/fe/section-a/all">科目Aを演習</a>
          <a href="#/quiz/fe/section-b/all" class="btn btn-secondary" data-nav="/quiz/fe/section-b/all">科目Bを演習</a>
          <a href="#/quiz/fe/mock-a/all" class="btn btn-secondary" data-nav="/quiz/fe/mock-a/all">科目A模試</a>
          <a href="#/quiz/fe/mock-b-1/all" class="btn btn-secondary" data-nav="/quiz/fe/mock-b-1/all">科目B模試</a>
          <a href="${feExamBlueprint.syllabusUrl}" class="btn btn-ghost" target="_blank" rel="noopener noreferrer">IPAシラバス ↗</a>
        </div>
      </div>
      <div class="fe-exam-specs">
        <article><span>${sectionA.label}</span><strong>${sectionA.questions}問 / ${sectionA.minutes}分</strong><p>${sectionA.focus}</p></article>
        <article><span>${sectionB.label}</span><strong>${sectionB.questions}問 / ${sectionB.minutes}分</strong><p>${sectionB.focus}</p></article>
        <article class="fe-exam-total"><span>HACKPATH収録</span><strong>${module.lessons.length}教材 / ${progress.total}問</strong><p>読むだけは自由。XPは回答で獲得します。</p></article>
      </div>
      <div class="fe-readiness" aria-label="基本情報 合格力チェック">
        <div class="fe-readiness-heading">
          <span class="eyebrow">READINESS SCAN</span>
          <h3>合格力チェック</h3>
          <p>まず全問に触れ、科目A 75%以上・科目B 80%以上を安定させることをHackPath内の学習目標にします。</p>
        </div>
        ${readiness.map((item) => `
          <article class="fe-readiness-card">
            <div><span>科目${item.section}</span><strong>${item.accuracy}%</strong></div>
            <p>${item.answered}/${item.total}問回答 · 網羅率${item.coverage}%</p>
            <div class="rank-meter"><span style="width:${item.coverage}%"></span></div>
          </article>
        `).join('')}
        <div class="fe-readiness-verdict ${(targetA && targetB) ? 'is-ready' : ''}">
          <strong>${targetA && targetB ? '模試仕上げ段階' : '強化継続'}</strong>
          <span>科目A ${targetA ? '目標到達' : '要強化'} / 科目B ${targetB ? '目標到達' : '要強化'}</span>
        </div>
      </div>
      <ol class="fe-study-cycle" aria-label="基本情報の推奨学習サイクル">
        <li><b>01</b><span>教材で「何か」を理解</span></li>
        <li><b>02</b><span>図と例で仕組みを説明</span></li>
        <li><b>03</b><span>科目別問題で根拠を確認</span></li>
        <li><b>04</b><span>不正解だけ再挑戦</span></li>
      </ol>
      <p class="source-note">試験仕様は2026年8月時点のIPA公開情報を基準に表示しています。HackPathの目標正答率は学習用の独自基準で、IPAの評価点600点と直接対応しません。HackPathは公式教材ではなく、問題はすべて独自作成です。</p>
    </section>
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
  bindFeMasteryCore(container)
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character])
}
