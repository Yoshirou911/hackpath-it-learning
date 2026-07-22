export function renderRankBadge(rank, options = {}) {
  const { compact = false, completed = false } = options
  return `
    <span class="rank-badge rank-${rank.id} ${compact ? 'rank-badge-compact' : ''} ${completed ? 'is-complete' : ''}">
      <span class="rank-gem" aria-hidden="true"></span>
      <span class="rank-badge-copy">
        <strong>${rank.name}</strong>
        ${compact ? '' : `<small>${rank.stage}</small>`}
      </span>
    </span>
  `
}

export function renderRankEmblem(rank) {
  return `
    <div class="rank-emblem rank-${rank.id}" aria-label="現在のランク ${rank.label}">
      <div class="rank-emblem-core">
        <span class="rank-emblem-mark">H</span>
      </div>
      <span class="rank-emblem-name">${rank.name}</span>
    </div>
  `
}
