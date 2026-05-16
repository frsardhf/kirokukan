import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'

export function AuthCallback() {
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    const params = new URLSearchParams(hash)
    const token = params.get('access_token')
    const errParam = params.get('error_description') ?? params.get('error')

    if (token) {
      setToken(token)
      refresh()
      window.history.replaceState({}, '', '/auth/callback')
      navigate('/anime/list/all', { replace: true })
      return
    }

    setError(errParam ?? 'No access token returned from AniList.')
  }, [navigate, refresh])

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center space-y-3">
          <p className="text-destructive font-medium">Sign-in failed</p>
          <p className="text-muted-foreground text-sm">{error}</p>
          <a href="/login" className="underline text-sm">
            Back to sign in
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <p className="text-muted-foreground text-sm">Signing you in…</p>
    </main>
  )
}
