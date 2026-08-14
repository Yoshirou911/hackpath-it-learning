import { currentVersion, latestRelease, releaseHistory } from '../data/releases.js'

export function renderUpdates() {
  return `
    <div class="page-header updates-header">
      <span class="eyebrow">SYSTEM CHANGELOG</span>
      <h1>アップデート情報</h1>
      <p class="page-subtitle">新機能、教材追加、改善、不具合修正をバージョンごとに確認できます。</p>
    </div>

    <section class="update-current glass-card" aria-labelledby="current-version-title">
      <div class="update-current-copy">
        <span class="update-status"><i aria-hidden="true"></i> CURRENT VERSION</span>
        <h2 id="current-version-title">HackPath v${currentVersion}</h2>
        <p>${latestRelease.title}</p>
      </div>
      <div class="update-current-meta">
        <span>RELEASED</span>
        <strong>${formatDate(latestRelease.date)}</strong>
      </div>
    </section>

    <section class="release-timeline" aria-label="バージョン履歴">
      ${releaseHistory.map((release, index) => renderRelease(release, index === 0)).join('')}
    </section>
  `
}

function renderRelease(release, isLatest) {
  return `
    <article class="release-card ${isLatest ? 'is-latest' : ''}">
      <div class="release-marker" aria-hidden="true"><span>${isLatest ? 'NOW' : release.version.split('.')[1]}</span></div>
      <div class="release-body glass-card">
        <header class="release-heading">
          <div>
            <span class="release-version">v${release.version}${isLatest ? '<b>最新</b>' : ''}</span>
            <h2>${release.title}</h2>
          </div>
          <time datetime="${release.date}">${formatDate(release.date)}</time>
        </header>
        <p class="release-summary">${release.summary}</p>
        <div class="release-highlights" aria-label="主な内容">
          ${release.highlights.map((item) => `<span>${item}</span>`).join('')}
        </div>
        <div class="release-sections">
          ${release.sections.map((section) => `
            <section class="release-section release-${section.type}">
              <h3><span aria-hidden="true">${typeIcon(section.type)}</span>${section.label}</h3>
              <ul>${section.items.map((item) => `<li>${item}</li>`).join('')}</ul>
            </section>
          `).join('')}
        </div>
      </div>
    </article>
  `
}

function typeIcon(type) {
  return { feature: '＋', improvement: '↗', fix: '✓' }[type] || '•'
}

function formatDate(value) {
  const [year, month, day] = value.split('-')
  return `${year}.${month}.${day}`
}
