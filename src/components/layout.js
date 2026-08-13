import { navigate, getCurrentPath } from '../router.js'
import { clearLocalSession, getCloudAccount, getState } from '../store.js'
import { getAccountRank } from '../data/ranks.js'
import { renderRankBadge } from './rank.js'
import { roadmapTopics } from '../data/topics.js'

const primaryNavItems = [
  { path: '/', label: 'ダッシュボード', icon: '⚡' },
  { path: '/roadmap', label: 'ロードマップ', icon: '🗺️' },
]

const toolNavItems = [
  { path: '/quiz', label: '問題演習', icon: '🧠' },
  { path: '/glossary', label: '用語集', icon: '📖' },
  { path: '/editor', label: 'ノート追加', icon: '📝' },
  { path: '/history', label: '履歴', icon: '📊' },
]

const certificationLabelAliases = {
  itp: 'ITパスポート',
  fe: '基本情報技術者',
  ap: '応用情報技術者',
  sec: 'セキュリティ基礎',
}

function topicToNavItem(topic) {
  return {
    path: topic.path,
    label: certificationLabelAliases[topic.id] || topic.title,
    icon: topic.icon,
  }
}

export const sidebarNavGroups = [
  {
    id: 'certification',
    label: '資格対策',
    icon: '🏅',
    description: '国家・ベンダー資格',
    items: roadmapTopics.filter((topic) => topic.category === 'certification' && topic.status === 'available').map(topicToNavItem),
  },
  {
    id: 'skill',
    label: 'ITスキル',
    icon: '🛠️',
    description: '実務・技術分野',
    items: roadmapTopics.filter((topic) => topic.category === 'skill' && topic.status === 'available').map(topicToNavItem),
  },
]

function isNavItemActive(item, currentPath) {
  return currentPath === item.path || (item.path !== '/' && currentPath.startsWith(`${item.path}/`))
}

function renderNavLink(item, currentPath) {
  return `
    <a href="#${item.path}" class="nav-link ${isNavItemActive(item, currentPath) ? 'active' : ''}" data-path="${item.path}" title="${item.label}">
      <span class="nav-icon" aria-hidden="true">${item.icon}</span>
      <span class="nav-label">${item.label}</span>
    </a>
  `
}

function renderNavGroup(group, currentPath) {
  const isOpen = group.items.some((item) => isNavItemActive(item, currentPath))
  return `
    <details class="sidebar-nav-group" ${isOpen ? 'open' : ''}>
      <summary>
        <span class="nav-group-icon" aria-hidden="true">${group.icon}</span>
        <span><strong>${group.label}</strong><small>${group.description}</small></span>
        <b>${group.items.length}</b>
      </summary>
      <div class="sidebar-nav-group-items">
        ${group.items.map((item) => renderNavLink(item, currentPath)).join('')}
      </div>
    </details>
  `
}

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
          <div class="sidebar-nav-section">
            <span class="sidebar-nav-heading">メイン</span>
            ${primaryNavItems.map((item) => renderNavLink(item, currentPath)).join('')}
          </div>

          <div class="sidebar-nav-section sidebar-course-groups">
            <span class="sidebar-nav-heading">コース</span>
            ${sidebarNavGroups.map((group) => renderNavGroup(group, currentPath)).join('')}
          </div>

          <div class="sidebar-nav-section">
            <span class="sidebar-nav-heading">学習ツール</span>
            ${toolNavItems.map((item) => renderNavLink(item, currentPath)).join('')}
          </div>
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
