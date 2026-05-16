import { useInfiniteQuery } from '@tanstack/react-query'
import { anilistRequest } from '@/lib/anilist/client'
import { BROWSE_SECTION_QUERY } from '@/lib/anilist/queries'
import type { BrowseMedia } from '@/lib/anilist/types'
import type { SectionConfig } from '@/lib/browseSections'
import { useViewer } from '@/hooks/useViewer'

interface PageResponse {
  Page: {
    pageInfo: { currentPage: number; hasNextPage: boolean }
    media: BrowseMedia[]
  }
}

export function useInfiniteBrowseSection(config: SectionConfig | undefined, type: Parameters<SectionConfig['getVariables']>[0]) {
  const { data: viewer } = useViewer()
  const userId = viewer?.id

  return useInfiniteQuery({
    queryKey: ['browse-section', config?.slug, type, userId],
    enabled: !!config,
    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const variables = { ...config!.getVariables(type), page: pageParam }
      const data = await anilistRequest<PageResponse>(BROWSE_SECTION_QUERY, variables)
      return data.Page
    },
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.currentPage + 1 : undefined,
  })
}
