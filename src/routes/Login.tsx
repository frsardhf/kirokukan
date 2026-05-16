import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { getAuthorizeUrl, getClientId } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'

export function Login() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/anime/list/all" replace />

  let configured = true
  let configError = ''
  try {
    getClientId()
  } catch (err) {
    configured = false
    configError = err instanceof Error ? err.message : String(err)
  }

  const handleLogin = () => {
    window.location.href = getAuthorizeUrl()
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="size-14 rounded-2xl bg-foreground text-background grid place-items-center text-2xl font-semibold">
            記
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Kiroku</h1>
            <p className="text-muted-foreground text-sm mt-1">Your personal anime archive.</p>
          </div>
        </div>

        {configured ? (
          <Button size="lg" className="w-full" onClick={handleLogin}>
            Continue with AniList
          </Button>
        ) : (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-left text-sm">
            <p className="font-medium text-destructive">Setup required</p>
            <p className="mt-1 text-muted-foreground">{configError}</p>
          </div>
        )}
      </div>
    </main>
  )
}
