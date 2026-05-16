const TOKEN_KEY = 'kiroku.anilist.token'
const CLIENT_ID = import.meta.env.VITE_ANILIST_CLIENT_ID as string | undefined

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getClientId(): string {
  if (!CLIENT_ID) {
    throw new Error(
      'VITE_ANILIST_CLIENT_ID is not set. Register an app at https://anilist.co/settings/developer and add the client id to .env',
    )
  }
  return CLIENT_ID
}

export function getAuthorizeUrl(): string {
  const id = getClientId()
  return `https://anilist.co/api/v2/oauth/authorize?client_id=${id}&response_type=token`
}
