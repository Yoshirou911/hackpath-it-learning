// コース検索と難易度フィルター。ロードマップの表示用機能で、保存データは扱わない。
import { roadmapTopics } from '../data/topics.js'
import { getStudyModule } from '../data/content.js'
import { getQuestionsByTopic } from '../data/questions.js'
import { getGlossaryByTopic } from '../data/glossary.js'
import { getTopicQuizProgress } from '../store.js'
import { getCourseRank } from '../data/ranks.js'
import { certificationDifficultyRanking } from '../data/certificationDifficulty.js'

export const COURSE_LEVEL_FILTERS = [
  { value: 'all', label: 'すべて' },
  { value: 'beginner', label: '基礎' },
  { value: 'intermediate', label: '応用' },
  { value: 'advanced', label: '上級' },
]

export const COURSE_CATEGORY_FILTERS = [
  { value: 'all', label: 'すべて' },
  { value: 'certification', label: 'IT資格' },
  { value: 'skill', label: '実務スキル' },
]

export const COURSE_SORT_OPTIONS = [
  { value: 'recommended', label: '標準' },
  { value: 'difficulty-asc', label: 'やさしい順' },
  { value: 'difficulty-desc', label: '難しい順' },
  { value: 'lessons-desc', label: '教材が多い順' },
]

const LEVEL_LABELS = {
  beginner: '基礎',
  intermediate: '応用',
  advanced: '上級',
}

// 資格は`certificationDifficulty.js`の推定点、実務スキルは宣言された難易度から目安点を割り当てる。
const LEVEL_FALLBACK_SCORE = { beginner: 30, intermediate: 60, advanced: 90 }
const difficultyByTopicId = new Map(certificationDifficultyRanking.map((entry) => [entry.topicId, entry]))

export function getCourseDifficulty(topic) {
  const estimate = difficultyByTopicId.get(topic.id)
  if (estimate) return { score: estimate.score, tier: estimate.tier, estimated: true }
  return { score: LEVEL_FALLBACK_SCORE[topic.level] ?? 50, tier: null, estimated: false }
}

export const DEFAULT_COURSE_FILTER = { query: '', level: 'all', category: 'all', includeUpcoming: false, sort: 'recommended' }

// 全角の記号やカタカナ幅の違いで検索が外れないよう、NFKC正規化してから比較する。
export function normalizeSearchText(value) {
  return String(value ?? '').normalize('NFKC').toLowerCase().trim()
}

function splitTerms(query) {
  return normalizeSearchText(query).split(/[\s、,]+/).filter(Boolean)
}

let cachedIndex = null

export function buildCourseSearchIndex(topics = roadmapTopics) {
  return topics.map((topic) => {
    const lessons = getStudyModule(topic.id)?.lessons || []
    const lessonTitles = lessons.map((lesson) => lesson.title)
    const terms = getGlossaryByTopic(topic.id).map((term) => term.term)
    const haystack = normalizeSearchText([
      topic.id,
      topic.title,
      topic.subtitle,
      topic.description,
      LEVEL_LABELS[topic.level] || '',
      topic.category === 'certification' ? 'IT資格 資格' : '実務スキル スキル',
      ...lessonTitles,
      ...terms,
    ].join(' '))
    return {
      topic,
      haystack,
      lessonTitles,
      lessonCount: lessons.length,
      questionCount: getQuestionsByTopic(topic.id).length,
      termCount: terms.length,
    }
  })
}

export function getCourseSearchIndex() {
  cachedIndex ??= buildCourseSearchIndex()
  return cachedIndex
}

function sortResults(results, sort) {
  if (sort === 'difficulty-asc') return [...results].sort((a, b) => a.difficulty.score - b.difficulty.score)
  if (sort === 'difficulty-desc') return [...results].sort((a, b) => b.difficulty.score - a.difficulty.score)
  if (sort === 'lessons-desc') return [...results].sort((a, b) => b.lessonCount - a.lessonCount)
  return results
}

export function searchCourses(filter = DEFAULT_COURSE_FILTER, index = getCourseSearchIndex()) {
  const terms = splitTerms(filter.query)
  const results = index
    .filter((entry) => {
      const { topic } = entry
      if (topic.status === 'locked' && !filter.includeUpcoming) return false
      if (filter.level !== 'all' && topic.level !== filter.level) return false
      if (filter.category !== 'all' && topic.category !== filter.category) return false
      return terms.every((term) => entry.haystack.includes(term))
    })
    .map((entry) => ({
      ...entry,
      difficulty: getCourseDifficulty(entry.topic),
      matchedLessons: terms.length === 0
        ? []
        : entry.lessonTitles.filter((title) => terms.some((term) => normalizeSearchText(title).includes(term))).slice(0, 3),
    }))
  return sortResults(results, filter.sort)
}

export function isCourseFilterActive(filter) {
  return Boolean(splitTerms(filter.query).length)
    || filter.level !== 'all'
    || filter.category !== 'all'
    || filter.includeUpcoming
    || (filter.sort && filter.sort !== 'recommended')
}

function escapeAttribute(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// 入力中のフォーカスを保つため、検索結果だけを差し替えられるよう分けて描画する。
export function renderCourseResults(filter = DEFAULT_COURSE_FILTER) {
  const results = searchCourses(filter)
  const active = isCourseFilterActive(filter)

  return `
    <p class="course-finder-count" role="status">
      ${active ? `${results.length}件のコースが一致しました。` : `全${results.length}コースを表示しています。キーワードや難易度で絞り込めます。`}
    </p>

    ${results.length === 0 ? `
      <div class="course-finder-empty">
        <p>条件に一致するコースがありません。</p>
        <button type="button" class="btn btn-secondary" data-course-reset>条件をリセット</button>
      </div>
    ` : `
      <div class="course-finder-grid">${results.map(renderCourseResult).join('')}</div>
    `}
  `
}

export function renderCourseFinder(filter = DEFAULT_COURSE_FILTER) {
  return `
    <section class="section course-finder-section" data-course-finder aria-labelledby="course-finder-title">
      <div class="section-header rank-section-header">
        <div>
          <span class="eyebrow">COURSE FINDER</span>
          <h2 id="course-finder-title">コースを探す</h2>
          <p class="progress-label">コース名・レッスン名・用語から検索し、難易度と分野で絞り込めます。難易度の並び順は資格難易度推定を使ったHackPath独自の目安です。</p>
        </div>
      </div>

      <div class="course-finder-controls">
        <div class="course-search-field">
          <span aria-hidden="true">🔍</span>
          <label class="course-search-label" for="course-search">キーワード検索</label>
          <input id="course-search" type="search" data-course-search
            value="${escapeAttribute(filter.query)}" placeholder="例: SQL、ネットワーク、基本情報" autocomplete="off">
          <button type="button" class="course-search-clear" data-course-reset aria-label="検索条件をすべて解除">×</button>
        </div>

        <div class="course-filter-row">
          <div class="course-filter-group" role="group" aria-label="難易度で絞り込む">
            <span>難易度</span>
            ${COURSE_LEVEL_FILTERS.map((option) => `
              <button type="button" class="course-filter-chip ${filter.level === option.value ? 'is-active' : ''}"
                data-course-level="${option.value}" aria-pressed="${filter.level === option.value}">${option.label}</button>
            `).join('')}
          </div>
          <div class="course-filter-group" role="group" aria-label="分野で絞り込む">
            <span>分野</span>
            ${COURSE_CATEGORY_FILTERS.map((option) => `
              <button type="button" class="course-filter-chip ${filter.category === option.value ? 'is-active' : ''}"
                data-course-category="${option.value}" aria-pressed="${filter.category === option.value}">${option.label}</button>
            `).join('')}
          </div>
          <div class="course-filter-group" role="group" aria-label="並び順を選ぶ">
            <span>並び順</span>
            ${COURSE_SORT_OPTIONS.map((option) => `
              <button type="button" class="course-filter-chip ${filter.sort === option.value ? 'is-active' : ''}"
                data-course-sort="${option.value}" aria-pressed="${filter.sort === option.value}">${option.label}</button>
            `).join('')}
          </div>
          <label class="course-upcoming-toggle">
            <input type="checkbox" data-course-upcoming ${filter.includeUpcoming ? 'checked' : ''}>
            準備中も表示
          </label>
        </div>
      </div>

      <div data-course-results>${renderCourseResults(filter)}</div>
    </section>
  `
}

function renderCourseResult(entry) {
  const { topic } = entry
  const progress = getTopicQuizProgress(topic.id)
  const rank = getCourseRank(progress.completed, progress.total)
  const locked = topic.status === 'locked'

  return `
    <article class="glass-card course-result-card rank-surface-${rank.id} ${locked ? 'is-locked' : ''}">
      <div class="course-result-top">
        <span class="topic-icon">${topic.icon}</span>
        <span class="course-chip-group">
          <span class="course-level-chip level-${topic.level}">${LEVEL_LABELS[topic.level] || topic.level}</span>
          ${entry.difficulty.tier ? `<span class="course-difficulty-chip difficulty-tier-${entry.difficulty.tier.toLowerCase()}" title="HackPath独自の難易度推定 ${entry.difficulty.score}/100">${entry.difficulty.tier} ${entry.difficulty.score}</span>` : ''}
        </span>
      </div>
      <h3>${topic.title}</h3>
      <p>${topic.description}</p>
      <ul class="course-result-meta">
        <li><b>${entry.lessonCount}</b>教材</li>
        <li><b>${entry.questionCount}</b>問</li>
        <li><b>${entry.termCount}</b>用語</li>
      </ul>
      ${entry.matchedLessons.length > 0 ? `
        <p class="course-result-hits"><span>一致した教材</span>${entry.matchedLessons.map((title) => `<i>${title}</i>`).join('')}</p>
      ` : ''}
      <div class="rank-card-footer">
        <div><div class="progress-bar"><div class="progress-fill" style="width: ${progress.pct}%; background: ${rank.color}"></div></div><small>${progress.completed}/${progress.total} 問正解</small></div>
        ${locked
          ? '<span class="rank-lock-label">COMING SOON</span>'
          : `<a href="#${topic.path}" class="rank-arrow-link" data-nav="${topic.path}" aria-label="${topic.title}を開く">↗</a>`}
      </div>
    </article>
  `
}
