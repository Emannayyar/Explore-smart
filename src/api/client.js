// Tiny fetch wrapper for the ExploreSmart API (proxied to the server by Vite in dev).
const BASE = '/api'
const KEY = 'token'

export const getToken = () => {
  try { return localStorage.getItem(KEY) } catch { return null }
}
export const setToken = (token) => {
  try { localStorage.setItem(KEY, token) } catch { /* storage unavailable */ }
}
export const clearToken = () => {
  try { localStorage.removeItem(KEY) } catch { /* storage unavailable */ }
}

async function request(method, path, body) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    const err = new Error('Could not reach the server')
    err.status = 0
    throw err
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body ?? {}),
  patch: (path, body) => request('PATCH', path, body ?? {}),
  put: (path, body) => request('PUT', path, body ?? {}),
  del: (path, body) => request('DELETE', path, body),
}
