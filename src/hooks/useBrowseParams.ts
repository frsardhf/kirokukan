import { useCallback, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { MediaFormat, MediaSeason, MediaSort, MediaStatus, MediaType } from '@/lib/anilist/types'
import { mediaTypeFromSlug, mediaTypeSlug } from '@/lib/media'

export const DEFAULT_SORT: MediaSort = 'POPULARITY_DESC'

export interface BrowseFilters {
  search: string
  genres: string[]
  tags: string[]
  year: number | null
  season: MediaSeason | null
  format: MediaFormat | null
  status: MediaStatus | null
  sort: MediaSort
}

const EMPTY: BrowseFilters = {
  search: '',
  genres: [],
  tags: [],
  year: null,
  season: null,
  format: null,
  status: null,
  sort: DEFAULT_SORT,
}

export function useBrowseParams() {
  const params = useParams<{ type?: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const type: MediaType = mediaTypeFromSlug(params.type) ?? 'ANIME'

  const filters: BrowseFilters = useMemo(
    () => ({
      search: searchParams.get('q') ?? '',
      genres: parseList(searchParams.get('genre')),
      tags: parseList(searchParams.get('tag')),
      year: parseNum(searchParams.get('year')),
      season: (searchParams.get('season') as MediaSeason | null) || null,
      format: (searchParams.get('format') as MediaFormat | null) || null,
      status: (searchParams.get('status') as MediaStatus | null) || null,
      sort: (searchParams.get('sort') as MediaSort | null) ?? DEFAULT_SORT,
    }),
    [searchParams],
  )

  const setFilters = useCallback(
    (next: Partial<BrowseFilters>) => {
      const merged = { ...filters, ...next }
      const np = new URLSearchParams()
      writeParam(np, 'q', merged.search)
      writeParam(np, 'genre', merged.genres.join(','))
      writeParam(np, 'tag', merged.tags.join(','))
      writeParam(np, 'year', merged.year ? String(merged.year) : '')
      writeParam(np, 'season', merged.season ?? '')
      writeParam(np, 'format', merged.format ?? '')
      writeParam(np, 'status', merged.status ?? '')
      writeParam(np, 'sort', merged.sort === DEFAULT_SORT ? '' : merged.sort)
      setSearchParams(np, { replace: true })
    },
    [filters, setSearchParams],
  )

  const replaceAll = useCallback(
    (raw: Record<string, string>) => {
      const np = new URLSearchParams(raw)
      setSearchParams(np, { replace: true })
    },
    [setSearchParams],
  )

  const setType = useCallback(
    (next: MediaType) => navigate(`/${mediaTypeSlug(next)}/browse/search`),
    [navigate],
  )

  const clearAll = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams])

  const activeCount = useMemo(() => {
    let n = 0
    n += filters.genres.length
    n += filters.tags.length
    if (filters.year) n += 1
    if (filters.season) n += 1
    if (filters.format) n += 1
    if (filters.status) n += 1
    return n
  }, [filters])

  const isEmpty = activeCount === 0 && !filters.search

  return { type, filters, setFilters, replaceAll, setType, clearAll, activeCount, isEmpty, defaultFilters: EMPTY }
}

function parseList(s: string | null): string[] {
  if (!s) return []
  return s.split(',').filter(Boolean)
}

function parseNum(s: string | null): number | null {
  if (!s) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

function writeParam(p: URLSearchParams, key: string, value: string) {
  if (value) p.set(key, value)
}
