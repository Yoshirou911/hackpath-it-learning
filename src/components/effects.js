const SOUND_KEY = 'hackpath-sound-enabled'

export function isSoundEnabled() {
  return localStorage.getItem(SOUND_KEY) !== 'false'
}

export function toggleSound() {
  const enabled = !isSoundEnabled()
  localStorage.setItem(SOUND_KEY, String(enabled))
  return enabled
}

export function playAnswerSound(correct) {
  playSequence(correct
    ? [{ frequency: 540, at: 0, duration: .08 }, { frequency: 760, at: .07, duration: .11 }]
    : [{ frequency: 210, at: 0, duration: .12 }, { frequency: 150, at: .08, duration: .16 }])
}

export function playClearSound() {
  playSequence([
    { frequency: 392, at: 0, duration: .12 },
    { frequency: 523, at: .1, duration: .12 },
    { frequency: 659, at: .2, duration: .14 },
    { frequency: 784, at: .31, duration: .28 },
  ])
}

export function showClearCelebration({ title = 'MISSION COMPLETE', subtitle = '学習データを記録しました', rank = null } = {}) {
  document.querySelector('.mission-celebration')?.remove()
  const overlay = document.createElement('div')
  overlay.className = `mission-celebration ${rank ? `rank-surface-${rank.id}` : 'rank-surface-gold'}`
  overlay.setAttribute('role', 'status')
  overlay.innerHTML = `
    <div class="celebration-burst" aria-hidden="true"></div>
    <div class="celebration-card">
      <span class="celebration-kicker">${rank ? 'RANK PROMOTION' : 'HACKPATH CLEAR'}</span>
      <strong>${rank ? `${rank.name} UNLOCKED` : title}</strong>
      <small>${rank ? `${rank.label}・${rank.stage}へ昇格` : subtitle}</small>
    </div>
    <div class="celebration-particles" aria-hidden="true">${Array.from({ length: 18 }, (_, index) => `<i style="--i:${index}"></i>`).join('')}</div>
  `
  document.body.appendChild(overlay)
  window.setTimeout(() => overlay.classList.add('is-visible'), 20)
  window.setTimeout(() => overlay.classList.add('is-leaving'), 1900)
  window.setTimeout(() => overlay.remove(), 2450)
}

function playSequence(notes) {
  if (!isSoundEnabled() || !window.AudioContext && !window.webkitAudioContext) return
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    const context = new AudioContextClass()
    notes.forEach(({ frequency, at, duration }) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(frequency, context.currentTime + at)
      gain.gain.setValueAtTime(.0001, context.currentTime + at)
      gain.gain.exponentialRampToValueAtTime(.075, context.currentTime + at + .015)
      gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + at + duration)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(context.currentTime + at)
      oscillator.stop(context.currentTime + at + duration + .02)
    })
    window.setTimeout(() => context.close(), 1000)
  } catch {
    // 音声を利用できない環境でも学習操作は継続する。
  }
}
