import type { MediaType } from '@/lib/anilist/types'
import { getCurrentSeason, getPreviousSeason } from '@/lib/media'

export interface BrowsePreset {
  id: string
  label: string
  types: MediaType[]
  getParams: () => Record<string, string>
}

const ALL_TYPES: MediaType[] = ['ANIME', 'MANGA']

export const BROWSE_PRESETS: BrowsePreset[] = [
  {
    id: 'this-season',
    label: 'This Season',
    types: ['ANIME'],
    getParams: () => {
      const cs = getCurrentSeason()
      return { season: cs.season, year: String(cs.year), sort: 'POPULARITY_DESC' }
    },
  },
  {
    id: 'last-season',
    label: 'Last Season',
    types: ['ANIME'],
    getParams: () => {
      const ps = getPreviousSeason()
      return { season: ps.season, year: String(ps.year), sort: 'POPULARITY_DESC' }
    },
  },
  {
    id: 'currently-airing',
    label: 'Currently Airing',
    types: ALL_TYPES,
    getParams: () => ({ status: 'RELEASING', sort: 'TRENDING_DESC' }),
  },
  {
    id: 'last-year-best',
    label: "Last Year's Best",
    types: ALL_TYPES,
    getParams: () => ({ year: String(new Date().getFullYear() - 1), sort: 'SCORE_DESC' }),
  },
  {
    id: 'anime',
    label: 'Anime',
    types: ['ANIME'],
    getParams: () => ({ format: 'TV', sort: 'POPULARITY_DESC' }),
  },
  {
    id: 'movies',
    label: 'Movies',
    types: ['ANIME'],
    getParams: () => ({ format: 'MOVIE', sort: 'POPULARITY_DESC' }),
  },
  {
    id: 'discover-new',
    label: 'Discover New',
    types: ALL_TYPES,
    getParams: () => ({ sort: 'TRENDING_DESC' }),
  },
]

export function getPresetsForType(type: MediaType): BrowsePreset[] {
  return BROWSE_PRESETS.filter((p) => p.types.includes(type))
}
