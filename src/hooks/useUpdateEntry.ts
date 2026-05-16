import { useMutation, useQueryClient } from '@tanstack/react-query'
import { anilistRequest } from '@/lib/anilist/client'
import { SAVE_MEDIA_LIST_ENTRY_MUTATION } from '@/lib/anilist/mutations'
import type {
  FuzzyDate,
  MediaListCollection,
  MediaListEntry,
  MediaListStatus,
} from '@/lib/anilist/types'
import { MEDIA_LIST_KEY } from '@/hooks/useMediaList'
import { MEDIA_WITH_ENTRY_KEY } from '@/hooks/useMediaWithEntry'
import { useViewer } from '@/hooks/useViewer'

export interface UpdateEntryInput {
  entry: MediaListEntry
  status?: MediaListStatus
  progress?: number
  progressVolumes?: number
  startedAt?: FuzzyDate
  completedAt?: FuzzyDate
}

interface Response {
  SaveMediaListEntry: Pick<
    MediaListEntry,
    | 'id'
    | 'mediaId'
    | 'status'
    | 'progress'
    | 'progressVolumes'
    | 'startedAt'
    | 'completedAt'
    | 'updatedAt'
  >
}

function fuzzyToInput(d: FuzzyDate | undefined) {
  if (!d) return undefined
  return { year: d.year, month: d.month, day: d.day }
}

function applyPatchToCollection(
  collection: MediaListCollection | undefined,
  entryId: number,
  patch: Partial<MediaListEntry>,
): MediaListCollection | undefined {
  if (!collection) return collection
  const nextStatus = patch.status
  return {
    ...collection,
    lists: collection.lists.map((list) => {
      const filtered = list.entries
        .map((e) => (e.id === entryId ? { ...e, ...patch } : e))
        .filter((e) => {
          if (e.id !== entryId) return true
          if (!nextStatus) return true
          if (list.status == null) return true
          return e.status === list.status
        })
      return { ...list, entries: filtered }
    }),
  }
}

export function useUpdateEntry() {
  const queryClient = useQueryClient()
  const { data: viewer } = useViewer()
  const userId = viewer?.id

  return useMutation({
    mutationFn: async (input: UpdateEntryInput) => {
      const isCreate = !input.entry.id
      const variables: Record<string, unknown> = {
        mediaId: input.entry.mediaId,
        status: input.status ?? input.entry.status,
        progress: input.progress ?? input.entry.progress,
        progressVolumes: input.progressVolumes ?? input.entry.progressVolumes,
        startedAt: fuzzyToInput(input.startedAt ?? input.entry.startedAt),
        completedAt: fuzzyToInput(input.completedAt ?? input.entry.completedAt),
      }
      if (!isCreate) variables.id = input.entry.id
      const data = await anilistRequest<Response>(SAVE_MEDIA_LIST_ENTRY_MUTATION, variables)
      return data.SaveMediaListEntry
    },
    onMutate: async (input) => {
      const isCreate = !input.entry.id
      const type = input.entry.media.type
      const key = [...MEDIA_LIST_KEY, type, userId]
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<MediaListCollection>(key)
      if (isCreate) return { previous, key }
      const patch: Partial<MediaListEntry> = {
        status: input.status ?? input.entry.status,
        progress: input.progress ?? input.entry.progress,
        progressVolumes: input.progressVolumes ?? input.entry.progressVolumes,
        startedAt: input.startedAt ?? input.entry.startedAt,
        completedAt: input.completedAt ?? input.entry.completedAt,
        updatedAt: Math.floor(Date.now() / 1000),
      }
      queryClient.setQueryData<MediaListCollection>(key, (old) =>
        applyPatchToCollection(old, input.entry.id, patch),
      )
      return { previous, key }
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.previous && ctx.key) {
        queryClient.setQueryData(ctx.key, ctx.previous)
      }
    },
    onSettled: (_data, _err, input) => {
      const type = input.entry.media.type
      queryClient.invalidateQueries({ queryKey: [...MEDIA_LIST_KEY, type, userId] })
      queryClient.invalidateQueries({ queryKey: [...MEDIA_WITH_ENTRY_KEY, input.entry.mediaId] })
    },
  })
}
