export function renderRankBadge(rank, options = {}) {
  const { compact = false, completed = false } = options
  return `
    <span class="rank-badge rank-surface-${rank.id} rank-${rank.id} ${compact ? 'rank-badge-compact' : ''} ${completed ? 'is-complete' : ''}">
      ${renderRankSigil(rank, 'rank-sigil-small')}
      <span class="rank-badge-copy">
        <strong>${rank.name}</strong>
        ${compact ? '' : `<small>${rank.stage}</small>`}
      </span>
    </span>
  `
}

export function renderRankEmblem(rank) {
  const tier = rankTier(rank)
  return `
    <div class="rank-emblem rank-surface-${rank.id} rank-${rank.id}" data-tier="${tier}" aria-label="現在のランク ${rank.label}">
      <span class="rank-emblem-wing wing-left" aria-hidden="true"></span>
      <span class="rank-emblem-wing wing-right" aria-hidden="true"></span>
      <div class="rank-emblem-core">
        <span class="rank-emblem-crown" aria-hidden="true">${tier >= 5 ? '✦' : tier >= 3 ? '◆' : '•'}</span>
        <span class="rank-emblem-mark">${rankMark(rank)}</span>
      </div>
      <span class="rank-emblem-name">${rank.name}</span>
      <span class="rank-emblem-pips" aria-hidden="true">${Array.from({ length: Math.min(3, Math.ceil(tier / 2)) }, () => '<i></i>').join('')}</span>
    </div>
  `
}

export function renderRankSigil(rank, className = '') {
  return `<span class="rank-sigil rank-surface-${rank.id} ${className}" aria-hidden="true"><i>${rankMark(rank)}</i></span>`
}

function rankTier(rank) {
  return ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'sovereign'].indexOf(rank.id) + 1
}

function rankMark(rank) {
  return ({ bronze: 'I', silver: 'II', gold: 'III', platinum: 'P', diamond: 'D', master: 'M', sovereign: 'S' })[rank.id] || 'H'
}
