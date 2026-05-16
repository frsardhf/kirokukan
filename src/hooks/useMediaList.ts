import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { anilistRequest } from '@/lib/anilist/client'
import { MEDIA_LIST_COLLECTION_QUERY } from '@/lib/anilist/queries'
import type {
  MediaListCollection,
  MediaListEntry,
  MediaListStatus,
  MediaType,
} from '@/lib/anilist/types'
import { useViewer } from '@/hooks/useViewer'

export const MEDIA_LIST_KEY = ['media-list'] as const

interface Response {
  MediaListCollection: MediaListCollection
}

function flatten(collection: MediaListCollection | undefined): MediaListEntry[] {
  if (!collection) return []
  const map = new Map<number, MediaListEntry>()
  for (const list of collection.lists) {
    for (const entry of list.entries) {
      const existing = map.get(entry.id)
      if (!existing || existing.updatedAt < entry.updatedAt) {
        map.set(entry.id, entry)
      }
    }
  }
  return Array.from(map.values())
}

function groupByStatus(entries: MediaListEntry[]): Record<MediaListStatus, MediaListEntry[]> {
  const groups: Record<MediaListStatus, MediaListEntry[]> = {
    CURRENT: [],
    COMPLETED: [],
    PLANNING: [],
    PAUSED: [],
    DROPPED: [],
    REPEATING: [],
  }
  for (const e of entries) {
    if (groups[e.status]) groups[e.status].push(e)
  }
  return groups
}

export function useMediaList(type: MediaType) {
  const { data: viewer } = useViewer()
  const userId = viewer?.id

  const query = useQuery({
    queryKey: [...MEDIA_LIST_KEY, type, userId],
    enabled: !!userId,
    staleTime: 1000 * 60,
    queryFn: async () => {
      const data = await anilistRequest<Response>(MEDIA_LIST_COLLECTION_QUERY, {
        userId,
        type,
      })
      return data.MediaListCollection
    },
  })

  const entries = useMemo(() => flatten(query.data), [query.data])
  const byStatus = useMemo(() => groupByStatus(entries), [entries])

  return { ...query, entries, byStatus }
}
