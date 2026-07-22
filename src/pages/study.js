import { getStudyModule } from '../data/content.js'
import { getTopicById } from '../data/topics.js'
import { getTopicProgress, completeLesson } from '../store.js'

export function renderStudy(path, params) {
  const topicId = params[0]
  const lessonId = params[1]

  const module = getStudyModule(topicId)
  const topic = getTopicById(topicId)

  if (!module || !topic) {
    return `
      <div class="page-header">
        <h1>トピックが見つかりません</h1>
      </div>
      <a href="#/roadmap" class="btn btn-secondary" data-nav="/roadmap">ロードマップに戻る</a>
    `
  }

  // レッスン一覧表示
  if (!lessonId) {
    const progress = getTopicProgress(topicId, module.lessons.length)
    
    const lessonList = module.lessons.map((lesson, index) => {
      const trackedLessons = progress.completedLessonIds || []
      const legacyCompleted = Math.max(0, progress.completed - trackedLessons.length)
      const isCompleted = trackedLessons.includes(lesson.id) || index < legacyCompleted
      return `
        <div class="glass-card" style="margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 24px;">${isCompleted ? '✅' : '📝'}</span>
            <div style="flex: 1;">
              <h4 style="margin: 0 0 4px;">${lesson.title}</h4>
              <p style="font-size: 14px; color: var(--text); opacity: 0.7; margin: 0;">レッスン ${index + 1}</p>
            </div>
            <a href="#/study/${topicId}/${lesson.id}" class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}" style="font-size: 13px;" data-nav="/study/${topicId}/${lesson.id}">
              ${isCompleted ? '復習する' : '学習する'}
            </a>
          </div>
        </div>
      `
    }).join('')

    return `
      <div class="page-header">
        <h1>${topic.title}</h1>
        <p class="page-subtitle">${topic.subtitle}</p>
      </div>

      <div class="glass-card" style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="topic-icon" style="font-size: 48px;">${topic.icon}</span>
          <div>
            <h3 style="margin: 0 0 8px;">進捗状況</h3>
            <div class="progress-bar" style="width: 300px;">
              <div class="progress-fill" style="width: ${progress.pct}%; background: ${topic.color}"></div>
            </div>
            <span class="progress-label">${progress.completed}/${progress.total} レッスン完了</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>レッスン一覧</h2>
        </div>
        ${lessonList}
      </div>
    `
  }

  // 個別レッスン表示
  const lesson = module.lessons.find(l => l.id === lessonId)
  if (!lesson) {
    return `
      <div class="page-header">
        <h1>レッスンが見つかりません</h1>
      </div>
      <a href="#/study/${topicId}" class="btn btn-secondary" data-nav="/study/${topicId}">トピックに戻る</a>
    `
  }

  const lessonIndex = module.lessons.findIndex(l => l.id === lessonId)
  const prevLesson = lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1] : null

  return `
    <div class="page-header">
      <a href="#/study/${topicId}" class="btn btn-ghost" style="margin-bottom: 16px;" data-nav="/study/${topicId}">← ${topic.title}に戻る</a>
      <h1>${lesson.title}</h1>
    </div>

    <div class="lesson-content">
      <div class="glass-card">
        <div class="lesson-content-body">
          ${lesson.content}
        </div>
      </div>

      <div class="quiz-nav" style="margin-top: 32px;">
        ${prevLesson ? `
          <a href="#/study/${topicId}/${prevLesson.id}" class="btn btn-secondary" data-nav="/study/${topicId}/${prevLesson.id}">
            ← 前のレッスン
          </a>
        ` : '<div></div>'}
        
        <button class="btn btn-primary" id="complete-lesson" data-topic="${topicId}" data-total="${module.lessons.length}" data-lesson="${lessonId}">
          ✅ レッスンを完了する
        </button>
        
        ${nextLesson ? `
          <a href="#/study/${topicId}/${nextLesson.id}" class="btn btn-secondary" data-nav="/study/${topicId}/${nextLesson.id}">
            次のレッスン →
          </a>
        ` : '<div></div>'}
      </div>
    </div>
  `
}

export function bindStudyEvents(container) {
  const completeBtn = container.querySelector('#complete-lesson')
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      const topicId = completeBtn.dataset.topic
      const totalLessons = parseInt(completeBtn.dataset.total)
      const lessonId = completeBtn.dataset.lesson
      completeLesson(topicId, totalLessons, lessonId)
      completeBtn.textContent = '✅ 完了しました！'
      completeBtn.disabled = true
      completeBtn.style.opacity = '0.7'
    })
  }
}
