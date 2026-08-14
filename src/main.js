import './style.css'
import { initRouter, registerRoute, navigate } from './router.js'
import { renderLayout, bindLayoutEvents, bindClickNav } from './components/layout.js'
import { renderDashboard } from './pages/dashboard.js'
import { renderRoadmap } from './pages/roadmap.js'
import { renderStudy, bindStudyEvents } from './pages/study.js'
import { renderQuiz, bindQuizEvents } from './pages/quiz.js'
import { renderGlossary, bindGlossaryEvents } from './pages/glossary.js'
import { renderHistory, bindHistoryEvents } from './pages/history.js'
import { renderEditor, bindEditorEvents } from './pages/editor.js'
import { renderUpdates } from './pages/updates.js'
import { initCloudProgress, setLastVisited } from './store.js'

// Register routes
registerRoute('/', renderDashboard)
registerRoute('/roadmap', renderRoadmap)
registerRoute('/study/:topicId', renderStudy)
registerRoute('/study/:topicId/:lessonId', renderStudy)
registerRoute('/security', () => {
  navigate('/study/sec')
  return ''
})
registerRoute('/quiz', renderQuiz)
registerRoute('/quiz/:topicFilter', renderQuiz)
registerRoute('/quiz/:topicFilter/:mode', renderQuiz)
registerRoute('/quiz/:topicFilter/:mode/:rankFilter', renderQuiz)
registerRoute('/glossary', renderGlossary)
registerRoute('/glossary/:topicFilter', renderGlossary)
registerRoute('/history', renderHistory)
registerRoute('/editor', renderEditor)
registerRoute('/updates', renderUpdates)

const app = document.querySelector('#app')
app.innerHTML = '<div class="sync-bootstrap"><span aria-hidden="true"></span><p>進捗データを準備しています</p></div>'

await initCloudProgress()

// Initialize router after the signed-in user's progress is ready.
initRouter((handler, path, params) => {
  const app = document.querySelector('#app')
  const content = handler(path, params)
  if (content === '') return
  app.innerHTML = renderLayout(content, path)
  
  bindLayoutEvents(app)
  bindClickNav(app)
  bindStudyEvents(app)
  bindQuizEvents(app)
  bindGlossaryEvents(app)
  bindHistoryEvents(app)
  bindEditorEvents(app)
  
  setLastVisited(path)
})
