import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { anilistRequest } from '@/lib/anilist/client'
import { BROWSE_FILTER_COUNT_QUERY } from '@/lib/anilist/queries'
import type { MediaType } from '@/lib/anilist/types'
import { buildFilterVariables } from '@/lib/browseFilterVars'
import type { BrowseFilters } from '@/hooks/useBrowseParams'

function useDebounced<T>(value: T, delay: number): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}

export function useBrowseFilterCount(type: MediaType, filters: BrowseFilters) {
  const debounced = useDebounced(filters, 300)

  return useQuery({
    queryKey: ['browse-filter-count', type, debounced],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const data = await anilistRequest<{ Page: { pageInfo: { total: number } } }>(
        BROWSE_FILTER_COUNT_QUERY,
        buildFilterVariables(type, debounced),
      )
      return data.Page.pageInfo.total
    },
  })
}
