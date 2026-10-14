// The only code that calls FastAPI. It prefixes VITE_API_URL, keeps the login
// tokens, attaches the access token as a bearer token, and throws an error
// carrying the response's `detail` on any non-2xx status.
//
// The frontend never talks to Supabase: login goes through POST /auth/login
// and the backend does the Supabase Auth call.

const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  throw new Error('Missing VITE_API_URL')
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// ASSUMPTION: the bodies of /auth/login and /auth/refresh are not in
// docs/screens.md yet. These shapes follow Supabase's token names; change them
// here if the backend differs.
interface Tokens {
  access_token: string
  refresh_token: string
}

const TOKENS_KEY = 'irpc.tokens'

function readTokens(): Tokens | null {
  try {
    const raw = localStorage.getItem(TOKENS_KEY)
    return raw ? (JSON.parse(raw) as Tokens) : null
  } catch {
    return null
  }
}

function saveTokens(tokens: Tokens): void {
  try {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
  } catch {
    // Storage blocked (private mode): the session lasts until the page reloads.
  }
}

function clearTokens(): void {
  try {
    localStorage.removeItem(TOKENS_KEY)
  } catch {
    // Nothing to clear.
  }
}

// One refresh at a time, so several requests that fail together share it.
let refreshing: Promise<boolean> | null = null

function refreshSession(): Promise<boolean> {
  refreshing ??= (async () => {
    const tokens = readTokens()
    if (!tokens) {
      return false
    }
    try {
      const fresh = await request<Tokens>(
        'POST',
        '/auth/refresh',
        { refresh_token: tokens.refresh_token },
        false,
      )
      saveTokens(fresh)
      return true
    } catch {
      clearTokens()
      return false
    } finally {
      refreshing = null
    }
  })()
  return refreshing
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  withAuth = true,
): Promise<T> {
  const headers = new Headers()
  const token = withAuth ? readTokens()?.access_token : undefined
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response
  try {
    response = await fetch(`${apiUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    // fetch only rejects when no response arrives: the backend is down, the
    // device is offline, or CORS blocked the request.
    throw new ApiError(
      0,
      'Could not reach the server. Check your connection and try again.',
    )
  }

  // Expired access token: refresh once and retry the same request.
  if (response.status === 401 && token && (await refreshSession())) {
    return request<T>(method, path, body, withAuth)
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readDetail(response))
  }

  // 204 No Content has no body to parse.
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

// FastAPI puts the error message in `detail`: a string for HTTPException, or a
// list of { msg, ... } objects for 422 validation errors.
async function readDetail(response: Response): Promise<string> {
  const fallback = `Request failed with status ${response.status}`

  let body: unknown
  try {
    body = await response.json()
  } catch {
    return fallback
  }

  if (typeof body !== 'object' || body === null || !('detail' in body)) {
    return fallback
  }
  const { detail } = body
  if (typeof detail === 'string') {
    return detail
  }
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item: { msg?: unknown } | null) => item?.msg)
      .filter((msg): msg is string => typeof msg === 'string')
    if (messages.length > 0) {
      return messages.join('; ')
    }
  }
  return fallback
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T = void>(path: string) => request<T>('DELETE', path),
}

export const session = {
  // True when tokens are stored. The server may still reject them; GET /me is
  // the real check.
  hasTokens: (): boolean => readTokens() !== null,

  // `identifier` is the phone or email. ASSUMPTION: field names, see above.
  async login(identifier: string, password: string): Promise<void> {
    const tokens = await request<Tokens>(
      'POST',
      '/auth/login',
      { identifier, password },
      false,
    )
    saveTokens(tokens)
  },

  // Tokens are cleared even if the server call fails, so the user is always
  // logged out on this device.
  async logout(): Promise<void> {
    try {
      await request<void>('POST', '/auth/logout')
    } finally {
      clearTokens()
    }
  },
}
