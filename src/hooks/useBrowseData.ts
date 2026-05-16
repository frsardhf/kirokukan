import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { anilistRequest } from '@/lib/anilist/client'
import { BROWSE_DATA_QUERY, BROWSE_DATA_MANGA_QUERY } from '@/lib/anilist/queries'
import type { BrowseMedia, MediaType } from '@/lib/anilist/types'
import { getCurrentSeason, getNextSeason } from '@/lib/media'
import { useViewer } from '@/hooks/useViewer'

export const BROWSE_KEY = ['browse'] as const

interface AnimeResponse {
  popularThisSeason: { media: BrowseMedia[] }
  trending: { media: BrowseMedia[] }
  upcomingNextSeason: { media: BrowseMedia[] }
  allTimePopular: { media: BrowseMedia[] }
  top100: { media: BrowseMedia[] }
}

interface MangaResponse {
  allTimePopular: { media: BrowseMedia[] }
  top100: { media: BrowseMedia[] }
}

export interface BrowseData {
  popularThisSeason: BrowseMedia[]
  trending: BrowseMedia[]
  upcomingNextSeason: BrowseMedia[]
  allTimePopular: BrowseMedia[]
  top100: BrowseMedia[]
}

export function useBrowseData(type: MediaType) {
  const { data: viewer } = useViewer()
  const userId = viewer?.id

  const animeVariables = useMemo(() => {
    const cur = getCurrentSeason()
    const nxt = getNextSeason()
    return {
      type,
      season: cur.season,
      seasonYear: cur.year,
      nextSeason: nxt.season,
      nextSeasonYear: nxt.year,
    }
  }, [type])

  return useQuery({
    queryKey: [...BROWSE_KEY, type, userId],
    staleTime: 1000 * 60 * 5,
    queryFn: async (): Promise<BrowseData> => {
      if (type === 'MANGA') {
        const data = await anilistRequest<MangaResponse>(BROWSE_DATA_MANGA_QUERY, { type })
        return {
          popularThisSeason: [],
          trending: [],
          upcomingNextSeason: [],
          allTimePopular: data.allTimePopular.media,
          top100: data.top100.media,
        }
      }
      const data = await anilistRequest<AnimeResponse>(BROWSE_DATA_QUERY, animeVariables)
      return {
        popularThisSeason: data.popularThisSeason.media,
        trending: data.trending.media,
        upcomingNextSeason: data.upcomingNextSeason.media,
        allTimePopular: data.allTimePopular.media,
        top100: data.top100.media,
      }
    },
  })
}
