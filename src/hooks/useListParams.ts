import { useCallback } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { MediaType } from '@/lib/anilist/types'
import {
  mediaTypeFromSlug,
  mediaTypeSlug,
  tabFromSlug,
  tabSlug,
  type ListTab,
} from '@/lib/media'
import { DEFAULT_SORT_BY_TAB, SORT_KEYS, type SortKey } from '@/lib/sort'
import { getStoredSort, setStoredSort, setStoredSortForAllTabs } from '@/lib/sortPrefs'

function isSortKey(v: string | null): v is SortKey {
  return !!v && (SORT_KEYS as string[]).includes(v)
}

function resolveSort(type: MediaType, tab: ListTab, urlSort: string | null): SortKey {
  if (isSortKey(urlSort)) return urlSort
  return getStoredSort(type, tab) ?? DEFAULT_SORT_BY_TAB[tab]
}

export function useListParams() {
  const params = useParams<{ type?: string; status?: string }>()
  const [search, setSearch] = useSearchParams()
  const navigate = useNavigate()

  const type: MediaType = mediaTypeFromSlug(params.type) ?? 'ANIME'
  const tab: ListTab = tabFromSlug(params.status) ?? 'ALL'
  const sortParam = search.get('sort')
  const sort: SortKey = resolveSort(type, tab, sortParam)

  const setTab = useCallback(
    (next: ListTab) => {
      navigate({
        pathname: `/${mediaTypeSlug(type)}/list/${tabSlug(next)}`,
        search: '',
      })
    },
    [navigate, type],
  )

  const setType = useCallback(
    (next: MediaType) => {
      navigate({
        pathname: `/${mediaTypeSlug(next)}/list/${tabSlug(tab)}`,
        search: '',
      })
    },
    [navigate, tab],
  )

  const setSort = useCallback(
    (next: SortKey) => {
      setStoredSort(type, tab, next)
      search.set('sort', next)
      setSearch(search, { replace: true })
    },
    [type, tab, search, setSearch],
  )

  const applyToAllTabs = useCallback(() => {
    setStoredSortForAllTabs(type, sort)
  }, [type, sort])

  return { type, tab, sort, setTab, setType, setSort, applyToAllTabs }
}
