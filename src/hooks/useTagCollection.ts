import { useQuery } from '@tanstack/react-query'
import { anilistRequest } from '@/lib/anilist/client'
import { MEDIA_TAG_COLLECTION_QUERY } from '@/lib/anilist/queries'
import type { MediaTag } from '@/lib/anilist/types'

export function useTagCollection() {
  return useQuery({
    queryKey: ['tag-collection'],
    staleTime: Infinity,
    queryFn: async () => {
      const data = await anilistRequest<{ MediaTagCollection: MediaTag[] }>(MEDIA_TAG_COLLECTION_QUERY)
      return data.MediaTagCollection.filter((t) => !t.isAdult)
    },
  })
}
