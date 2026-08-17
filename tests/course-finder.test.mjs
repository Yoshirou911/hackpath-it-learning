import assert from 'node:assert/strict'
import test from 'node:test'

globalThis.localStorage = {
  getItem: () => null,
  setItem() {},
  removeItem() {},
}
globalThis.window = globalThis
globalThis.document = { addEventListener() {}, visibilityState: 'visible' }

const {
  buildCourseSearchIndex,
  searchCourses,
  isCourseFilterActive,
  normalizeSearchText,
  renderCourseFinder,
  DEFAULT_COURSE_FILTER,
  COURSE_LEVEL_FILTERS,
  COURSE_CATEGORY_FILTERS,
  COURSE_SORT_OPTIONS,
  getCourseDifficulty,
} = await import('../src/components/courseFinder.js')
const { roadmapTopics } = await import('../src/data/topics.js')

const index = buildCourseSearchIndex()

test('検索インデックスは全コースを収録し、教材・問題・用語数を持つ', () => {
  assert.equal(index.length, roadmapTopics.length)
  const fe = index.find((entry) => entry.topic.id === 'fe')
  assert.ok(fe.lessonCount > 0)
  assert.ok(fe.questionCount > 0)
  assert.ok(fe.termCount > 0)
  assert.ok(fe.lessonTitles.length === fe.lessonCount)
})

test('既定では公開済みコースだけを表示し、準備中は含めない', () => {
  const results = searchCourses(DEFAULT_COURSE_FILTER, index)
  const available = roadmapTopics.filter((topic) => topic.status !== 'locked')

  assert.equal(results.length, available.length)
  assert.ok(results.every((entry) => entry.topic.status !== 'locked'))
  assert.equal(isCourseFilterActive(DEFAULT_COURSE_FILTER), false)
})

test('準備中を含める指定で未公開コースも表示する', () => {
  const filter = { ...DEFAULT_COURSE_FILTER, includeUpcoming: true }
  const results = searchCourses(filter, index)

  assert.equal(results.length, roadmapTopics.length)
  assert.equal(isCourseFilterActive(filter), true)
})

test('難易度と分野の絞り込みが一致するコースだけを返す', () => {
  COURSE_LEVEL_FILTERS.filter((option) => option.value !== 'all').forEach((option) => {
    const results = searchCourses({ ...DEFAULT_COURSE_FILTER, level: option.value }, index)
    assert.ok(results.length > 0, `${option.value}のコースが存在する`)
    assert.ok(results.every((entry) => entry.topic.level === option.value))
  })

  COURSE_CATEGORY_FILTERS.filter((option) => option.value !== 'all').forEach((option) => {
    const results = searchCourses({ ...DEFAULT_COURSE_FILTER, category: option.value }, index)
    assert.ok(results.length > 0, `${option.value}のコースが存在する`)
    assert.ok(results.every((entry) => entry.topic.category === option.value))
  })
})

test('コース名・レッスン名・用語からコースを検索できる', () => {
  const byTitle = searchCourses({ ...DEFAULT_COURSE_FILTER, query: '基本情報' }, index)
  assert.ok(byTitle.some((entry) => entry.topic.id === 'fe'))

  const byLesson = searchCourses({ ...DEFAULT_COURSE_FILTER, query: 'SQL' }, index)
  assert.ok(byLesson.length > 0)
  assert.ok(byLesson.some((entry) => entry.matchedLessons.length > 0))

  const noHit = searchCourses({ ...DEFAULT_COURSE_FILTER, query: '存在しない架空のコース名' }, index)
  assert.equal(noHit.length, 0)
})

test('全角・大文字小文字の違いを無視して検索する', () => {
  assert.equal(normalizeSearchText('ＳＱＬ'), 'sql')

  const wide = searchCourses({ ...DEFAULT_COURSE_FILTER, query: 'ＳＱＬ' }, index)
  const narrow = searchCourses({ ...DEFAULT_COURSE_FILTER, query: 'sql' }, index)
  assert.deepEqual(wide.map((entry) => entry.topic.id), narrow.map((entry) => entry.topic.id))
})

test('複数キーワードはすべて含むコースへ絞り込む', () => {
  const single = searchCourses({ ...DEFAULT_COURSE_FILTER, query: 'ネットワーク' }, index)
  const both = searchCourses({ ...DEFAULT_COURSE_FILTER, query: 'ネットワーク 資格' }, index)

  assert.ok(both.length > 0)
  assert.ok(both.length <= single.length)
  assert.ok(both.every((entry) => entry.topic.category === 'certification'))
})

test('資格は難易度推定、実務スキルは宣言難易度から目安点を得る', () => {
  const certification = getCourseDifficulty({ id: 'sc', level: 'intermediate' })
  assert.equal(certification.tier, 'S')
  assert.equal(certification.estimated, true)
  assert.ok(certification.score > 90)

  const skill = getCourseDifficulty({ id: 'network', level: 'beginner' })
  assert.equal(skill.tier, null)
  assert.equal(skill.estimated, false)
  assert.equal(skill.score, 30)
})

test('難易度と教材数で並び替えできる', () => {
  const easyFirst = searchCourses({ ...DEFAULT_COURSE_FILTER, sort: 'difficulty-asc' }, index)
  const hardFirst = searchCourses({ ...DEFAULT_COURSE_FILTER, sort: 'difficulty-desc' }, index)
  const byLessons = searchCourses({ ...DEFAULT_COURSE_FILTER, sort: 'lessons-desc' }, index)

  const easyScores = easyFirst.map((entry) => entry.difficulty.score)
  assert.deepEqual(easyScores, [...easyScores].sort((a, b) => a - b))
  assert.ok(hardFirst[0].difficulty.score >= easyFirst[0].difficulty.score)

  const lessonCounts = byLessons.map((entry) => entry.lessonCount)
  assert.deepEqual(lessonCounts, [...lessonCounts].sort((a, b) => b - a))

  assert.equal(isCourseFilterActive({ ...DEFAULT_COURSE_FILTER, sort: 'difficulty-asc' }), true)
})

test('検索欄と難易度・分野・並び順の操作要素を描画する', () => {
  const html = renderCourseFinder(DEFAULT_COURSE_FILTER)

  assert.match(html, /data-course-search/)
  assert.match(html, /data-course-results/)
  assert.match(html, /data-course-upcoming/)
  COURSE_LEVEL_FILTERS.forEach((option) => assert.match(html, new RegExp(`data-course-level="${option.value}"`)))
  COURSE_CATEGORY_FILTERS.forEach((option) => assert.match(html, new RegExp(`data-course-category="${option.value}"`)))
  COURSE_SORT_OPTIONS.forEach((option) => assert.match(html, new RegExp(`data-course-sort="${option.value}"`)))
})
