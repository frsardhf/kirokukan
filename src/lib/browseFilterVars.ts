import type { MediaType } from '@/lib/anilist/types'
import type { BrowseFilters } from '@/hooks/useBrowseParams'

export function buildFilterVariables(type: MediaType, f: BrowseFilters): Record<string, unknown> {
  const v: Record<string, unknown> = { type, sort: [f.sort] }
  if (f.search.trim()) v.search = f.search.trim()
  if (f.genres.length) v.genre_in = f.genres
  if (f.tags.length) v.tag_in = f.tags
  if (f.year) v.seasonYear = f.year
  if (f.season) v.season = f.season
  if (f.format) v.format = f.format
  if (f.status) v.status = f.status
  return v
}
