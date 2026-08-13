import { questions } from './questions.js'

export const achievementDefinitions = [
  { id: 'first-step', name: 'FIRST CONTACT', label: '初陣', icon: '01', description: '最初の問題に回答', test: ({ answered }) => answered >= 1 },
  { id: 'first-clear', name: 'SYSTEM ONLINE', label: '初クリア', icon: '✓', description: '最初の正解を獲得', test: ({ correct }) => correct >= 1 },
  { id: 'ten-clear', name: 'QUICK LEARNER', label: '急成長', icon: '10', description: '10問正解', test: ({ correct }) => correct >= 10 },
  { id: 'fifty-clear', name: 'FIELD EXPERT', label: '実戦知識', icon: '50', description: '50問正解', test: ({ correct }) => correct >= 50 },
  { id: 'century', name: 'CENTURY CORE', label: '百戦錬磨', icon: '100', description: '100問正解', test: ({ correct }) => correct >= 100 },
  { id: 'pathfinder', name: 'PATHFINDER', label: '開拓者', icon: '◇', description: '5分野で問題に回答', test: ({ topics }) => topics >= 5 },
  { id: 'all-rounder', name: 'ALL ROUNDER', label: '万能型', icon: '✦', description: '10分野で問題に回答', test: ({ topics }) => topics >= 10 },
  { id: 'master-rank', name: 'MASTER CORE', label: '知識の達人', icon: 'M', description: 'マスターランクへ到達', test: ({ xp }) => xp >= 2100 },
  { id: 'sovereign-rank', name: 'SOVEREIGN MIND', label: '知識の最高位', icon: '♛', description: 'ソヴリンランクへ到達', test: ({ xp }) => xp >= 3200 },
]

export function getAchievements(state) {
  const answeredMap = state?.quiz?.answered || {}
  const topicByQuestion = new Map(questions.map((question) => [String(question.id), question.topic]))
  const answeredTopics = new Set(Object.keys(answeredMap).map((id) => topicByQuestion.get(String(id))).filter(Boolean))
  const context = {
    answered: Object.keys(answeredMap).length,
    correct: Object.values(answeredMap).filter(Boolean).length,
    topics: answeredTopics.size,
    xp: Number(state?.xp) || 0,
  }
  return achievementDefinitions.map((achievement) => ({ ...achievement, unlocked: achievement.test(context) }))
}
