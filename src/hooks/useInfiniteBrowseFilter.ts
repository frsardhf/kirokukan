import { useInfiniteQuery } from '@tanstack/react-query'
import { anilistRequest } from '@/lib/anilist/client'
import { BROWSE_FILTER_QUERY } from '@/lib/anilist/queries'
import type { BrowseMedia, MediaType } from '@/lib/anilist/types'
import { buildFilterVariables } from '@/lib/browseFilterVars'
import type { BrowseFilters } from '@/hooks/useBrowseParams'
import { useViewer } from '@/hooks/useViewer'

interface PageResponse {
  Page: {
    pageInfo: { currentPage: number; hasNextPage: boolean; total: number }
    media: BrowseMedia[]
  }
}

export function useInfiniteBrowseFilter(type: MediaType, filters: BrowseFilters) {
  const { data: viewer } = useViewer()
  const userId = viewer?.id

  return useInfiniteQuery({
    queryKey: ['browse-filter', type, filters, userId],
    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const variables = { ...buildFilterVariables(type, filters), page: pageParam }
      const data = await anilistRequest<PageResponse>(BROWSE_FILTER_QUERY, variables)
      return data.Page
    },
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.currentPage + 1 : undefined,
  })
}
