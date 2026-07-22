export const learningRanks = [
  {
    id: 'bronze',
    name: 'BRONZE',
    label: 'ブロンズ',
    stage: '基礎',
    tagline: '土台を構築する',
    xpMin: 0,
    color: '#d99058',
  },
  {
    id: 'silver',
    name: 'SILVER',
    label: 'シルバー',
    stage: '応用',
    tagline: '知識を組み合わせる',
    xpMin: 500,
    color: '#b8c4d6',
  },
  {
    id: 'gold',
    name: 'GOLD',
    label: 'ゴールド',
    stage: '上級',
    tagline: '実践で使いこなす',
    xpMin: 1500,
    color: '#ffd166',
  },
]

export function getAccountRank(xp = 0) {
  const safeXP = Number.isFinite(Number(xp)) ? Number(xp) : 0
  let currentIndex = 0
  learningRanks.forEach((rank, index) => {
    if (safeXP >= rank.xpMin) currentIndex = index
  })

  const current = learningRanks[currentIndex]
  const next = learningRanks[currentIndex + 1] || null
  const progress = next
    ? Math.round(((safeXP - current.xpMin) / (next.xpMin - current.xpMin)) * 100)
    : 100

  return {
    current,
    next,
    progress: Math.max(0, Math.min(100, progress)),
    remainingXP: next ? Math.max(0, next.xpMin - safeXP) : 0,
  }
}

export function getStageLayout(totalLessons) {
  const total = Math.max(0, Number(totalLessons) || 0)
  const base = Math.floor(total / learningRanks.length)
  const remainder = total % learningRanks.length
  let start = 0

  return learningRanks.map((rank, index) => {
    const size = base + (index < remainder ? 1 : 0)
    const end = start + size
    const stage = {
      ...rank,
      index,
      start,
      end,
      size,
      lessonIndexes: Array.from({ length: size }, (_, offset) => start + offset),
    }
    start += size
    return stage
  })
}

export function getLessonRank(lessonIndex, totalLessons) {
  return getStageLayout(totalLessons).find((rank) => lessonIndex >= rank.start && lessonIndex < rank.end)
    || learningRanks[0]
}

export function getCourseRank(completedLessons, totalLessons) {
  const completed = Math.max(0, Number(completedLessons) || 0)
  const stages = getStageLayout(totalLessons)
  if (!totalLessons) return stages[0]
  if (completed >= totalLessons) return stages[2]
  if (completed >= stages[1].start) return stages[1]
  return stages[0]
}
