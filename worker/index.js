export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api/')) {
      return withSecurityHeaders(await handleApiRequest(request, env, url))
    }

    const assetResponse = await env.ASSETS.fetch(request)
    return withSecurityHeaders(assetResponse)
  },
}

const PROGRESS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS user_progress (
    user_email TEXT PRIMARY KEY NOT NULL,
    display_name TEXT,
    state_json TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`

async function handleApiRequest(request, env, url) {
  if (url.pathname === '/api/me' && request.method === 'GET') {
    const user = getAuthenticatedUser(request)
    return jsonResponse(user
      ? { authenticated: true, user }
      : { authenticated: false, signInUrl: signInPath('/#/') })
  }

  if (url.pathname !== '/api/progress') return jsonResponse({ error: 'Not found' }, 404)

  const user = getAuthenticatedUser(request)
  if (!user) {
    return jsonResponse({
      error: 'Authentication required',
      signInUrl: signInPath('/#/'),
    }, 401)
  }
  if (!env.DB) return jsonResponse({ error: 'Progress storage is unavailable' }, 503)

  await env.DB.prepare(PROGRESS_SCHEMA).run()

  if (request.method === 'GET') {
    const row = await env.DB.prepare(`
      SELECT state_json, version, updated_at
      FROM user_progress
      WHERE user_email = ?
    `).bind(user.email).first()

    if (!row) return jsonResponse({ progress: null })
    try {
      return jsonResponse({
        progress: JSON.parse(row.state_json),
        version: row.version,
        updatedAt: row.updated_at,
      })
    } catch {
      return jsonResponse({ error: 'Stored progress is invalid' }, 500)
    }
  }

  if (request.method === 'PUT') {
    if (!isSameOriginRequest(request, url)) return jsonResponse({ error: 'Invalid origin' }, 403)
    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > 250_000) return jsonResponse({ error: 'Progress payload is too large' }, 413)

    let payload
    try {
      payload = await request.json()
    } catch {
      return jsonResponse({ error: 'Invalid JSON' }, 400)
    }

    const progress = sanitizeProgress(payload?.progress)
    if (!progress) return jsonResponse({ error: 'Invalid progress data' }, 400)
    const stateJson = JSON.stringify(progress)
    if (stateJson.length > 250_000) return jsonResponse({ error: 'Progress payload is too large' }, 413)

    await env.DB.prepare(`
      INSERT INTO user_progress (user_email, display_name, state_json, version, updated_at)
      VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(user_email) DO UPDATE SET
        display_name = excluded.display_name,
        state_json = excluded.state_json,
        version = user_progress.version + 1,
        updated_at = CURRENT_TIMESTAMP
    `).bind(user.email, user.displayName, stateJson).run()

    const saved = await env.DB.prepare(`
      SELECT version, updated_at FROM user_progress WHERE user_email = ?
    `).bind(user.email).first()
    return jsonResponse({ saved: true, version: saved?.version, updatedAt: saved?.updated_at })
  }

  return jsonResponse({ error: 'Method not allowed' }, 405, { Allow: 'GET, PUT' })
}

function getAuthenticatedUser(request) {
  const email = request.headers.get('oai-authenticated-user-email')?.trim()
  if (!email || email.length > 320) return null
  const normalizedEmail = email.toLowerCase()
  const encodedName = request.headers.get('oai-authenticated-user-full-name')
  const encoding = request.headers.get('oai-authenticated-user-full-name-encoding')
  let fullName = null
  if (encodedName && encoding === 'percent-encoded-utf-8') {
    try {
      fullName = decodeURIComponent(encodedName)
    } catch {
      fullName = null
    }
  }
  return { email: normalizedEmail, displayName: fullName || normalizedEmail }
}

// テストから検証できるようにエクスポートする（Worker本体の動作には影響しない）。
export function sanitizeProgress(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const xp = clampInteger(value.xp, 0, 10_000_000)
  const level = Math.floor(xp / 100) + 1
  const quiz = sanitizeQuiz(value.quiz)
  const topics = sanitizeRecord(value.topics, 200, sanitizeTopic)
  const flashcards = sanitizeBooleanRecord(value.flashcards, 10_000)
  const history = Array.isArray(value.history)
    ? value.history.slice(0, 100).map(sanitizeHistoryEntry).filter(Boolean)
    : []
  const lastVisited = typeof value.lastVisited === 'string' && value.lastVisited.startsWith('/')
    ? value.lastVisited.slice(0, 300)
    : '/'
  const daily = sanitizeDaily(value.daily)
  return { xp, level, quiz, topics, flashcards, lastVisited, history, daily }
}

// 日別成績は`YYYY-MM-DD`キーのみを受け付け、直近180日へ制限する。
function sanitizeDaily(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const entries = Object.entries(value)
    .filter(([key, day]) => /^\d{4}-\d{2}-\d{2}$/.test(key) && day && typeof day === 'object' && !Array.isArray(day))
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(-180)
    .map(([key, day]) => [key, {
      answered: clampInteger(day.answered, 0, 1_000_000),
      correct: clampInteger(day.correct, 0, 1_000_000),
      lessons: clampInteger(day.lessons, 0, 1_000_000),
      xp: clampInteger(day.xp, 0, 1_000_000),
    }])
  return Object.fromEntries(entries)
}

function sanitizeQuiz(value) {
  const answered = sanitizeBooleanRecord(value?.answered, 10_000)
  const total = Object.keys(answered).length
  const correct = Object.values(answered).filter(Boolean).length
  return { answered, correct, total }
}

function sanitizeTopic(value) {
  if (!value || typeof value !== 'object') return null
  const total = clampInteger(value.total, 0, 10_000)
  const completed = clampInteger(value.completed, 0, total)
  const completedLessonIds = Array.isArray(value.completedLessonIds)
    ? [...new Set(value.completedLessonIds.filter((id) => typeof id === 'string').map((id) => id.slice(0, 120)))].slice(0, 10_000)
    : []
  return { completed, total, completedLessonIds }
}

function sanitizeHistoryEntry(value) {
  if (!value || typeof value !== 'object') return null
  const timestamp = typeof value.timestamp === 'string' ? value.timestamp.slice(0, 40) : new Date().toISOString()
  const type = value.type === 'quiz' || value.type === 'lesson' ? value.type : null
  if (!type) return null
  const data = sanitizeHistoryData(value.data)
  return { id: clampInteger(value.id, 0, Number.MAX_SAFE_INTEGER), type, data, timestamp }
}

function sanitizeHistoryData(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).slice(0, 20).flatMap(([key, item]) => {
    if (!/^[a-z0-9_-]{1,80}$/i.test(key)) return []
    if (typeof item === 'string') return [[key, item.slice(0, 500)]]
    if (typeof item === 'boolean') return [[key, item]]
    if (typeof item === 'number' && Number.isFinite(item)) return [[key, item]]
    return []
  }))
}

function sanitizeRecord(value, limit, sanitizer) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).slice(0, limit).flatMap(([key, item]) => {
    if (!/^[a-z0-9_-]{1,80}$/i.test(key)) return []
    const sanitized = sanitizer(item)
    return sanitized ? [[key, sanitized]] : []
  }))
}

function sanitizeBooleanRecord(value, limit) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).slice(0, limit).flatMap(([key, item]) => (
    typeof item === 'boolean' && key.length <= 120 ? [[key, item]] : []
  )))
}

function clampInteger(value, min, max) {
  const number = Number(value)
  if (!Number.isFinite(number)) return min
  return Math.max(min, Math.min(max, Math.floor(number)))
}

function isSameOriginRequest(request, url) {
  const origin = request.headers.get('origin')
  return !origin || origin === url.origin
}

function signInPath(returnTo) {
  return `/signin-with-chatgpt?return_to=${encodeURIComponent(returnTo)}`
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  })
}

function withSecurityHeaders(response) {
    const headers = new Headers(response.headers)

    headers.set('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "worker-src 'self'",
      'upgrade-insecure-requests',
    ].join('; '))
    headers.set('Cross-Origin-Opener-Policy', 'same-origin')
    headers.set('Cross-Origin-Resource-Policy', 'same-origin')
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()')
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('X-Frame-Options', 'DENY')

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
}
