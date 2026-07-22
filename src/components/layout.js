import { navigate, getCurrentPath } from '../router.js'
import { clearLocalSession, getCloudAccount, getState } from '../store.js'
import { getAccountRank } from '../data/ranks.js'
import { renderRankBadge } from './rank.js'

const navItems = [
  { path: '/', label: 'ダッシュボード', icon: '⚡' },
  { path: '/roadmap', label: 'ロードマップ', icon: '🗺️' },
  { path: '/study/itp', label: 'ITパスポート', icon: '📘' },
  { path: '/study/fe', label: '基本情報', icon: '💻' },
  { path: '/study/ap', label: '応用情報', icon: '🎯' },
  { path: '/security', label: 'セキュリティ', icon: '🔒' },
  { path: '/study/network', label: 'ネットワーク', icon: '🌐' },
  { path: '/study/linux', label: 'Linux', icon: '🐧' },
  { path: '/study/database', label: 'DB・SQL', icon: '🗄️' },
  { path: '/study/web', label: 'Web開発', icon: '🕸️' },
  { path: '/quiz', label: '問題演習', icon: '🧠' },
  { path: '/glossary', label: '用語集', icon: '📖' },
  { path: '/history', label: '履歴', icon: '📊' },
]

export function renderLayout(content, activePath) {
  const state = getState()
  const xpInLevel = state.xp % 100
  const accountRank = getAccountRank(state.xp).current
  const cloudAccount = getCloudAccount()
  const currentPath = activePath || getCurrentPath()

  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="brand-icon">⚡</span>
          <div>
            <h1 class="brand-title">HackPath</h1>
            <p class="brand-tagline">IT知識の道をハックせよ</p>
          </div>
        </div>

        <nav class="sidebar-nav">
          ${navItems.map((item) => `
            <a href="#${item.path}" class="nav-link ${currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path)) ? 'active' : ''}" data-path="${item.path}">
              <span class="nav-icon">${item.icon}</span>
              ${item.label}
            </a>
          `).join('')}
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-rank">
            <span class="sidebar-rank-label">OPERATOR RANK</span>
            ${renderRankBadge(accountRank, { compact: true })}
          </div>
          <div class="level-badge">
            <span class="level-label">LV.${state.level}</span>
            <div class="xp-bar">
              <div class="xp-fill" style="width: ${xpInLevel}%"></div>
            </div>
            <span class="xp-text">${state.xp} XP</span>
          </div>
        </div>
      </aside>

      <div class="main-area">
        <header class="topbar">
          <button class="menu-toggle" aria-label="メニュー">☰</button>
          <div class="topbar-title"></div>
          ${renderCloudAccount(cloudAccount)}
        </header>
        <main class="page-content">
          ${content}
        </main>
      </div>
    </div>
  `
}

function renderCloudAccount(account) {
  if (account.status === 'checking') {
    return `<div class="cloud-account is-checking"><span class="cloud-dot"></span><span>同期を確認中</span></div>`
  }
  if (account.status === 'anonymous') {
    return `
      <a class="cloud-account cloud-signin" href="${account.signInUrl}">
        <span class="cloud-dot"></span><span>ChatGPTでログインして進捗保存</span>
      </a>
    `
  }
  const displayName = escapeHtml(account.user?.displayName || account.user?.email || 'ユーザー')
  return `
    <div class="cloud-account ${account.status === 'synced' ? 'is-synced' : 'is-offline'}">
      <span class="cloud-dot"></span>
      <span class="cloud-account-copy"><strong>${displayName}</strong><small>${account.status === 'synced' ? 'クラウド保存 ON' : '端末へ保存中'}</small></span>
      <a href="/signout-with-chatgpt?return_to=%2F%23%2F" data-cloud-signout>ログアウト</a>
    </div>
  `
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character])
}

export function bindLayoutEvents(container) {
  const toggle = container.querySelector('.menu-toggle')
  const sidebar = container.querySelector('.sidebar')

  toggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('open')
  })

  container.querySelector('[data-cloud-signout]')?.addEventListener('click', clearLocalSession)

  container.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const path = link.dataset.path
      navigate(path)
      sidebar?.classList.remove('open')
    })
  })
}

export function bindClickNav(container) {
  container.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      navigate(el.dataset.nav)
    })
  })
}
