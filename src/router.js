const routes = new Map()

export function registerRoute(path, handler) {
  routes.set(path, handler)
}

export function navigate(path) {
  window.location.hash = path
}

export function getCurrentPath() {
  const hash = window.location.hash.slice(1) || '/'
  return hash.split('?')[0]
}

export function initRouter(onRender) {
  function resolve() {
    const path = getCurrentPath()

    if (routes.has(path)) {
      onRender(routes.get(path), path)
      return
    }

    for (const [pattern, handler] of routes) {
      if (pattern.includes(':')) {
        const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$')
        const match = path.match(regex)
        if (match) {
          onRender(handler, path, match.slice(1))
          return
        }
      }
    }

    onRender(routes.get('/404') || routes.get('/'), path)
  }

  window.addEventListener('hashchange', resolve)
  resolve()
}
