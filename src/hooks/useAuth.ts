import { useCallback, useEffect, useState } from 'react'
import { clearToken, getToken } from '@/lib/auth'

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(() => getToken())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === 'kiroku.anilist.token') {
        setTokenState(getToken())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const refresh = useCallback(() => setTokenState(getToken()), [])

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
  }, [])

  return { token, isAuthenticated: !!token, refresh, logout }
}
