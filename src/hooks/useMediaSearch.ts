import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { anilistRequest } from '@/lib/anilist/client'
import { MEDIA_SEARCH_QUERY } from '@/lib/anilist/queries'
import type { BrowseMedia, MediaType } from '@/lib/anilist/types'

interface Response {
  Page: { media: BrowseMedia[] }
}

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export function useMediaSearch(query: string, type: MediaType) {
  const debounced = useDebounced(query.trim(), 250)
  return useQuery({
    queryKey: ['media-search', type, debounced],
    enabled: debounced.length > 0,
    staleTime: 1000 * 60,
    queryFn: async (): Promise<BrowseMedia[]> => {
      const data = await anilistRequest<Response>(MEDIA_SEARCH_QUERY, {
        search: debounced,
        type,
      })
      return data.Page.media
    },
  })
}
