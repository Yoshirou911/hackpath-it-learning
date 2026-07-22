import { glossary, getGlossaryByTopic } from '../data/glossary.js'
import { roadmapTopics } from '../data/topics.js'
import { navigate } from '../router.js'

let currentTopic = 'itp'
let currentIndex = 0
let isFlipped = false
let shuffledTerms = []

export function renderGlossary(path, params = []) {
  const topicFilter = params[0] || 'itp'
  currentTopic = topicFilter
  currentIndex = 0
  isFlipped = false
  shuffledTerms = shuffleArray([...getGlossaryByTopic(currentTopic)])

  const topicOptions = roadmapTopics.filter((topic) => getGlossaryByTopic(topic.id).length > 0)

  return `
    <div class="page-header">
      <h1>用語集・フラッシュカード</h1>
      <p class="page-subtitle">重要用語を暗記しよう</p>
    </div>

    <div class="glass-card" style="margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
        <div>
          <span style="font-size: 14px; color: var(--text); opacity: 0.7;">トピック:</span>
          <select id="topic-filter" style="padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg); color: var(--text-h); margin-left: 8px;">
            ${topicOptions.map(opt => `
              <option value="${opt.id}" ${topicFilter === opt.id ? 'selected' : ''}>${opt.title}</option>
            `).join('')}
          </select>
        </div>
        <div style="margin-left: auto;">
          <span style="font-size: 14px; color: var(--text); opacity: 0.7;">${shuffledTerms.length}語</span>
        </div>
      </div>
    </div>

    <div class="glossary-container">
      <div id="flashcard-content">
        ${renderFlashcard()}
      </div>
    </div>
  `
}

function renderFlashcard() {
  if (shuffledTerms.length === 0) {
    return `
      <div class="glass-card" style="text-align: center; padding: 48px;">
        <p style="font-size: 18px; margin-bottom: 16px;">用語がありません</p>
        <a href="#/roadmap" class="btn btn-secondary" data-nav="/roadmap">ロードマップに戻る</a>
      </div>
    `
  }

  if (currentIndex >= shuffledTerms.length) {
    return `
      <div class="glass-card" style="text-align: center; padding: 48px;">
        <h2 style="margin-bottom: 16px;">🎉 全て完了！</h2>
        <p style="font-size: 18px; margin-bottom: 24px;">
          ${shuffledTerms.length}語の学習が完了しました
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-primary" id="restart-cards">もう一度</button>
          <a href="#/" class="btn btn-secondary" data-nav="/">ダッシュボードへ</a>
        </div>
      </div>
    `
  }

  const term = shuffledTerms[currentIndex]
  const topic = roadmapTopics.find(t => t.id === currentTopic)

  return `
    <div class="flashcard-wrapper">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <span style="font-size: 14px; color: var(--text); opacity: 0.7;">
          ${currentIndex + 1} / ${shuffledTerms.length}
        </span>
        <span style="font-size: 14px; color: var(--text); opacity: 0.7;">
          ${topic ? topic.title : ''}
        </span>
      </div>

      <div class="flashcard ${isFlipped ? 'flipped' : ''}" id="flashcard">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <div class="flashcard-content">
              <h3 class="flashcard-term">${term.term}</h3>
              ${term.reading ? `<p class="flashcard-reading">${term.reading}</p>` : ''}
              <p class="flashcard-hint">クリックして答えを表示</p>
            </div>
          </div>
          <div class="flashcard-back">
            <div class="flashcard-content">
              <h3 class="flashcard-term">${term.term}</h3>
              ${term.reading ? `<p class="flashcard-reading">${term.reading}</p>` : ''}
              <p class="flashcard-definition">${term.definition}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flashcard-nav">
        <button class="btn btn-secondary" id="prev-card" ${currentIndex === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
          ← 前へ
        </button>
        
        <button class="btn btn-primary" id="shuffle-cards">
          🔀 シャッフル
        </button>
        
        <button class="btn btn-primary" id="next-card">
          ${currentIndex < shuffledTerms.length - 1 ? '次へ →' : '完了'}
        </button>
      </div>
    </div>
  `
}

function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function bindGlossaryEvents(container) {
  const topicFilter = container.querySelector('#topic-filter')
  if (topicFilter && !topicFilter.dataset.eventsBound) {
    topicFilter.dataset.eventsBound = 'true'
    topicFilter.addEventListener('change', (e) => {
      const value = e.target.value
      navigate(value ? `/glossary/${value}` : '/glossary')
    })
  }

  const restartBtn = container.querySelector('#restart-cards')
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentIndex = 0
      isFlipped = false
      shuffledTerms = shuffleArray([...getGlossaryByTopic(currentTopic)])
      container.querySelector('#flashcard-content').innerHTML = renderFlashcard()
      bindGlossaryEvents(container)
    })
  }

  const flashcard = container.querySelector('#flashcard')
  if (flashcard) {
    flashcard.addEventListener('click', () => {
      isFlipped = !isFlipped
      flashcard.classList.toggle('flipped', isFlipped)
    })
  }

  const nextBtn = container.querySelector('#next-card')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < shuffledTerms.length - 1) {
        currentIndex++
        isFlipped = false
        container.querySelector('#flashcard-content').innerHTML = renderFlashcard()
        bindGlossaryEvents(container)
      }
    })
  }

  const prevBtn = container.querySelector('#prev-card')
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--
        isFlipped = false
        container.querySelector('#flashcard-content').innerHTML = renderFlashcard()
        bindGlossaryEvents(container)
      }
    })
  }

  const shuffleBtn = container.querySelector('#shuffle-cards')
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      shuffledTerms = shuffleArray([...getGlossaryByTopic(currentTopic)])
      currentIndex = 0
      isFlipped = false
      container.querySelector('#flashcard-content').innerHTML = renderFlashcard()
      bindGlossaryEvents(container)
    })
  }
}
