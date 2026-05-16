import type { MediaType } from '@/lib/anilist/types'
import { getCurrentSeason, getNextSeason } from '@/lib/media'

export interface SectionConfig {
  slug: string
  title: string
  animeOnly?: boolean
  getVariables: (type: MediaType) => Record<string, unknown>
}

export const BROWSE_SECTIONS: SectionConfig[] = [
  {
    slug: 'popular-this-season',
    title: 'Popular This Season',
    animeOnly: true,
    getVariables: (type) => {
      const { season, year } = getCurrentSeason()
      return { type, season, seasonYear: year, sort: ['POPULARITY_DESC'] }
    },
  },
  {
    slug: 'trending',
    title: 'Trending Now',
    getVariables: (type) => ({ type, sort: ['TRENDING_DESC'] }),
  },
  {
    slug: 'upcoming',
    title: 'Upcoming Next Season',
    animeOnly: true,
    getVariables: (type) => {
      const { season, year } = getNextSeason()
      return { type, season, seasonYear: year, sort: ['POPULARITY_DESC'], status: 'NOT_YET_RELEASED' }
    },
  },
  {
    slug: 'all-time-popular',
    title: 'All-Time Popular',
    getVariables: (type) => ({ type, sort: ['POPULARITY_DESC'] }),
  },
  {
    slug: 'top-rated',
    title: 'Top Rated',
    getVariables: (type) => ({ type, sort: ['SCORE_DESC'] }),
  },
]

export function getSectionConfig(slug: string): SectionConfig | undefined {
  return BROWSE_SECTIONS.find((s) => s.slug === slug)
}
