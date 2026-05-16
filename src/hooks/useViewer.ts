import { useQuery } from '@tanstack/react-query'
import { anilistRequest } from '@/lib/anilist/client'
import { VIEWER_QUERY } from '@/lib/anilist/queries'
import type { Viewer } from '@/lib/anilist/types'
import { useAuth } from '@/hooks/useAuth'

export function useViewer() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['viewer'],
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 60,
    queryFn: async () => {
      const data = await anilistRequest<{ Viewer: Viewer }>(VIEWER_QUERY)
      return data.Viewer
    },
  })
}
