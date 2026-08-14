const LEVELS = [
  { id: 'bronze', name: '基礎', label: 'BRONZE', rgb: '215, 135, 75' },
  { id: 'silver', name: '応用', label: 'SILVER', rgb: '159, 179, 204' },
  { id: 'gold', name: '上級', label: 'GOLD', rgb: '240, 191, 79' },
]

export const FE_MASTERY_DOMAINS = [
  { id: 'theory-ai', short: '理論・AI', name: '基礎理論・データ・AI' },
  { id: 'computer-os', short: '構成・OS', name: 'コンピュータ構成・OS' },
  { id: 'network', short: 'ネットワーク', name: 'ネットワーク' },
  { id: 'database', short: 'DB', name: 'データベース' },
  { id: 'security', short: 'セキュリティ', name: '情報セキュリティ' },
  { id: 'development', short: '開発', name: '開発技術・Web' },
  { id: 'management', short: '戦略・管理', name: 'マネジメント・ストラテジ・法務' },
  { id: 'algorithm', short: 'アルゴリズム', name: 'アルゴリズム・プログラミング' },
]

export function getFeMasteryDomainId(question) {
  if (question.bDomain === 'security') return 'security'
  if (question.bDomain === 'algorithm' || question.examSection === 'B') return 'algorithm'

  const category = String(question.category || '')
  if (/基礎理論|データ・AI/.test(category)) return 'theory-ai'
  if (/コンピュータ構成|OS・仮想化/.test(category)) return 'computer-os'
  if (/ネットワーク/.test(category)) return 'network'
  if (/データベース/.test(category)) return 'database'
  if (/セキュリティ/.test(category)) return 'security'
  if (/開発技術/.test(category)) return 'development'
  if (/マネジメント|ストラテジ|法務・会計/.test(category)) return 'management'

  const numericId = Number(question.id)
  if (numericId === 9 || (numericId >= 43 && numericId <= 48)) return 'theory-ai'
  if (numericId === 10 || (numericId >= 49 && numericId <= 65)) return 'computer-os'
  if (numericId === 11 || (numericId >= 66 && numericId <= 70)) return 'database'
  if (numericId === 12) return 'network'
  if (numericId === 13) return 'algorithm'
  if (numericId === 14) return 'development'

  const text = `${question.question || ''} ${question.explanation || ''}`
  if (/暗号|認証|攻撃|脆弱|権限/.test(text)) return 'security'
  if (/SQL|データベース|正規化|トランザクション/.test(text)) return 'database'
  if (/TCP|UDP|IP|ネットワーク|HTTP/.test(text)) return 'network'
  if (/アルゴリズム|配列|探索|スタック|キュー/.test(text)) return 'algorithm'
  return 'management'
}

export function getFeMasteryLevelId(question) {
  if (question.level === 'advanced' || Number(question.difficulty) >= 4) return 'gold'
  if (question.level === 'intermediate' || Number(question.difficulty) === 3) return 'silver'
  return 'bronze'
}

export function getFeMasterySnapshot(questions, answeredMap = {}) {
  const cells = new Map()
  FE_MASTERY_DOMAINS.forEach((domain) => {
    LEVELS.forEach((level) => cells.set(`${domain.id}:${level.id}`, {
      domainId: domain.id,
      levelId: level.id,
      total: 0,
      answered: 0,
      correct: 0,
    }))
  })

  questions.forEach((question) => {
    const key = `${getFeMasteryDomainId(question)}:${getFeMasteryLevelId(question)}`
    const cell = cells.get(key)
    if (!cell) return
    cell.total += 1
    if (question.id in answeredMap) cell.answered += 1
    if (answeredMap[question.id] === true) cell.correct += 1
  })

  const calculate = (cell) => {
    const coverage = cell.total ? Math.round((cell.answered / cell.total) * 100) : 0
    const accuracy = cell.answered ? Math.round((cell.correct / cell.answered) * 100) : 0
    const mastery = Math.round(accuracy * 0.6 + coverage * 0.4)
    return { ...cell, coverage, accuracy, mastery }
  }
  const scoredCells = [...cells.values()].map(calculate)
  const domains = FE_MASTERY_DOMAINS.map((domain) => ({
    ...domain,
    levels: LEVELS.map((level) => ({
      ...level,
      ...scoredCells.find((cell) => cell.domainId === domain.id && cell.levelId === level.id),
    })),
  }))
  const total = scoredCells.reduce((sum, cell) => sum + cell.total, 0)
  const answered = scoredCells.reduce((sum, cell) => sum + cell.answered, 0)
  const correct = scoredCells.reduce((sum, cell) => sum + cell.correct, 0)
  const coverage = total ? Math.round((answered / total) * 100) : 0
  const accuracy = answered ? Math.round((correct / answered) * 100) : 0

  return {
    domains,
    total,
    answered,
    correct,
    coverage,
    accuracy,
    mastery: Math.round(accuracy * 0.6 + coverage * 0.4),
  }
}

export function renderFeMasteryCore(questions, answeredMap = {}) {
  const snapshot = getFeMasterySnapshot(questions, answeredMap)
  const gradients = LEVELS.map((level, levelIndex) => buildRingGradient(snapshot.domains, levelIndex, level.rgb))

  return `
    <section class="fe-mastery-core" data-fe-mastery-core style="--mastery-angle:22.5deg">
      <header class="fe-mastery-header">
        <div>
          <span class="eyebrow">PERSONAL MASTERY MAP</span>
          <h2>理解度コア</h2>
          <p>分野と学習レベルを同時に見て、知識の穴を発見します。</p>
        </div>
        <div class="fe-mastery-legend" aria-label="理解度コアのリング">
          ${LEVELS.map((level) => `<span class="rank-surface-${level.id}"><i></i>${level.name}</span>`).join('')}
        </div>
      </header>
      <div class="fe-mastery-layout">
        <div class="fe-mastery-visual">
          <div class="fe-mastery-orbit" role="img" aria-label="全体理解度${snapshot.mastery}%、内側から基礎・応用・上級の3層">
            <div class="fe-mastery-ring fe-mastery-ring-gold" style="background:${gradients[2]}">
              <div class="fe-mastery-ring-cutout">
                <div class="fe-mastery-ring fe-mastery-ring-silver" style="background:${gradients[1]}">
                  <div class="fe-mastery-ring-cutout">
                    <div class="fe-mastery-ring fe-mastery-ring-bronze" style="background:${gradients[0]}">
                      <div class="fe-mastery-center">
                        <span>OVERALL</span>
                        <strong>${snapshot.mastery}%</strong>
                        <small>${snapshot.answered}/${snapshot.total}問回答</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <i class="fe-mastery-selector" aria-hidden="true"></i>
            ${snapshot.domains.map((domain, index) => `<span class="fe-mastery-orbit-index" style="--domain-angle:${index * 45 + 22.5}deg"><b style="--domain-counter-angle:${-(index * 45 + 22.5)}deg">${index + 1}</b></span>`).join('')}
          </div>
          <div class="fe-mastery-domains" aria-label="理解度を確認する分野">
            ${snapshot.domains.map((domain, index) => `
              <button type="button" data-mastery-domain="${domain.id}" data-mastery-index="${index}" aria-pressed="${index === 0}">
                <b>${String(index + 1).padStart(2, '0')}</b><span>${domain.short}</span>
              </button>
            `).join('')}
          </div>
        </div>
        <div class="fe-mastery-details">
          ${snapshot.domains.map((domain, index) => renderDomainPanel(domain, index === 0)).join('')}
        </div>
      </div>
      <footer class="fe-mastery-footer">
        <span>理解度 = 正答率60% + 回答網羅率40%</span>
        <span>HackPath独自の学習指標です</span>
      </footer>
    </section>
  `
}

function buildRingGradient(domains, levelIndex, rgb) {
  const stops = []
  domains.forEach((domain, index) => {
    const start = index * 45
    const end = start + 41
    const mastery = domain.levels[levelIndex].mastery
    const alpha = Math.min(0.96, 0.14 + mastery * 0.0082).toFixed(2)
    stops.push(`rgba(${rgb},${alpha}) ${start}deg ${end}deg`, `rgba(3,9,18,.78) ${end}deg ${start + 45}deg`)
  })
  return `conic-gradient(${stops.join(',')})`
}

function renderDomainPanel(domain, selected) {
  const weakest = [...domain.levels].filter((level) => level.total > 0).sort((a, b) => a.mastery - b.mastery)[0] || domain.levels[0]
  const mode = weakest.answered < weakest.total ? 'unanswered' : weakest.correct < weakest.answered ? 'incorrect' : 'all'
  const action = mode === 'unanswered' ? '未回答を進める' : mode === 'incorrect' ? '不正解を解き直す' : '定着を確認する'
  return `
    <article class="fe-mastery-domain-panel" data-mastery-panel="${domain.id}" ${selected ? '' : 'hidden'}>
      <span class="eyebrow">SELECTED DOMAIN</span>
      <h3>${domain.name}</h3>
      <div class="fe-mastery-level-list">
        ${domain.levels.map((level) => `
          <div class="fe-mastery-level rank-surface-${level.id}">
            <div><span>${level.label} · ${level.name}</span><strong>${level.mastery}%</strong></div>
            <div class="fe-mastery-meter"><i style="width:${level.mastery}%"></i></div>
            <p>正答率 ${level.accuracy}% · 網羅率 ${level.coverage}% · ${level.answered}/${level.total}問</p>
          </div>
        `).join('')}
      </div>
      <div class="fe-mastery-next rank-surface-${weakest.id}">
        <span>NEXT MISSION</span>
        <strong>${weakest.name}レベルを強化</strong>
        <p>${weakest.total - weakest.answered > 0 ? `未回答が${weakest.total - weakest.answered}問あります。` : `正答率は${weakest.accuracy}%です。`} ${action}と理解度が更新されます。</p>
        <a href="#/quiz/fe/${mode}/${weakest.id}" class="btn btn-primary" data-nav="/quiz/fe/${mode}/${weakest.id}">${action} →</a>
      </div>
    </article>
  `
}

export function bindFeMasteryCore(container) {
  const root = container.querySelector('[data-fe-mastery-core]')
  if (!root) return
  const buttons = [...root.querySelectorAll('[data-mastery-domain]')]
  const panels = [...root.querySelectorAll('[data-mastery-panel]')]
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const domainId = button.dataset.masteryDomain
      const index = Number(button.dataset.masteryIndex) || 0
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)))
      panels.forEach((panel) => { panel.hidden = panel.dataset.masteryPanel !== domainId })
      root.style.setProperty('--mastery-angle', `${index * 45 + 22.5}deg`)
    })
  })
}
