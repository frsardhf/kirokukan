import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { anilistRequest } from '@/lib/anilist/client'
import { MEDIA_LIST_COLLECTION_QUERY } from '@/lib/anilist/queries'
import type { MediaListCollection, MediaType } from '@/lib/anilist/types'
import { MEDIA_LIST_KEY } from '@/hooks/useMediaList'
import { useViewer } from '@/hooks/useViewer'

interface Response {
  MediaListCollection: MediaListCollection
}

const TYPES: MediaType[] = ['ANIME', 'MANGA']

export function usePrefetchMediaLists() {
  const queryClient = useQueryClient()
  const { data: viewer } = useViewer()
  const userId = viewer?.id

  useEffect(() => {
    if (!userId) return
    for (const type of TYPES) {
      queryClient.prefetchQuery({
        queryKey: [...MEDIA_LIST_KEY, type, userId],
        staleTime: 1000 * 60,
        queryFn: async () => {
          const data = await anilistRequest<Response>(MEDIA_LIST_COLLECTION_QUERY, {
            userId,
            type,
          })
          return data.MediaListCollection
        },
      })
    }
  }, [queryClient, userId])
}
