import './style.css'
import { initRouter, registerRoute, navigate } from './router.js'
import { renderLayout, bindLayoutEvents, bindClickNav } from './components/layout.js'
import { renderDashboard } from './pages/dashboard.js'
import { renderRoadmap } from './pages/roadmap.js'
import { renderStudy, bindStudyEvents } from './pages/study.js'
import { renderQuiz, bindQuizEvents } from './pages/quiz.js'
import { renderGlossary, bindGlossaryEvents } from './pages/glossary.js'
import { renderHistory, bindHistoryEvents } from './pages/history.js'
import { setLastVisited } from './store.js'

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
registerRoute('/glossary', renderGlossary)
registerRoute('/glossary/:topicFilter', renderGlossary)
registerRoute('/history', renderHistory)

// Initialize router
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
  
  setLastVisited(path)
})
