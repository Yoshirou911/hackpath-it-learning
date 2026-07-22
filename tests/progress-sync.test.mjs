import assert from 'node:assert/strict'
import test from 'node:test'

function installBrowserMocks(initialStorage, onUpload) {
  const values = new Map(Object.entries(initialStorage))
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  }
  globalThis.window = globalThis
  globalThis.document = { addEventListener() {}, visibilityState: 'visible' }
  globalThis.fetch = async (url, options = {}) => {
    if (url === '/api/me') {
      return response({ authenticated: true, user: { email: 'new@example.com', displayName: 'New User' } })
    }
    if (url === '/api/progress' && !options.method) return response({ progress: null })
    if (url === '/api/progress' && options.method === 'PUT') {
      onUpload(JSON.parse(options.body).progress)
      return response({ saved: true })
    }
    throw new Error(`Unexpected request: ${url}`)
  }
  return values
}

function response(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() { return body },
  }
}

test('別アカウントの端末キャッシュを新ユーザーへ移行しない', async () => {
  let uploaded
  const storage = installBrowserMocks({
    'hackpath-progress-owner': 'old@example.com',
    'hackpath-progress': JSON.stringify({ xp: 999, level: 10 }),
  }, (progress) => { uploaded = progress })

  const store = await import('../src/store.js?account-switch')
  await store.initCloudProgress()

  assert.equal(uploaded.xp, 0)
  assert.equal(storage.get('hackpath-progress-owner'), 'new@example.com')
})

test('所有者情報のない旧localStorageは初回ログイン時に移行する', async () => {
  let uploaded
  const storage = installBrowserMocks({
    'hackpath-progress': JSON.stringify({ xp: 42, level: 1 }),
  }, (progress) => { uploaded = progress })

  const store = await import('../src/store.js?legacy-migration')
  await store.initCloudProgress()

  assert.equal(uploaded.xp, 42)
  assert.equal(storage.get('hackpath-progress-owner'), 'new@example.com')
})
