import type { MediaListEntry, MediaType } from '@/lib/anilist/types'
import { fuzzyDateTimestamp, type ListTab } from '@/lib/media'

export type SortKey =
  | 'completedAt'
  | 'startedAt'
  | 'updatedAt'
  | 'createdAt'
  | 'title'
  | 'airStart'
  | 'length'

export const SORT_KEYS: SortKey[] = [
  'completedAt',
  'startedAt',
  'updatedAt',
  'createdAt',
  'title',
  'airStart',
  'length',
]

export function getSortOptions(type: MediaType): { value: SortKey; label: string }[] {
  return [
    { value: 'completedAt', label: 'Completed Date' },
    { value: 'startedAt', label: 'Start Date' },
    { value: 'updatedAt', label: 'Last Updated' },
    { value: 'createdAt', label: 'Last Added' },
    { value: 'title', label: 'Title' },
    { value: 'airStart', label: type === 'ANIME' ? 'Air Start' : 'Release Start' },
    { value: 'length', label: type === 'ANIME' ? 'Episodes' : 'Chapters' },
  ]
}

export const DEFAULT_SORT_BY_TAB: Record<ListTab, SortKey> = {
  ALL: 'updatedAt',
  CURRENT: 'updatedAt',
  COMPLETED: 'completedAt',
  PLANNING: 'createdAt',
  PAUSED: 'updatedAt',
  DROPPED: 'updatedAt',
  REPEATING: 'updatedAt',
}

function numericKey(entry: MediaListEntry, key: SortKey): number {
  switch (key) {
    case 'completedAt':
      return fuzzyDateTimestamp(entry.completedAt)
    case 'startedAt':
      return fuzzyDateTimestamp(entry.startedAt)
    case 'updatedAt':
      return (entry.updatedAt ?? 0) * 1000
    case 'createdAt':
      return (entry.createdAt ?? 0) * 1000
    case 'airStart':
      return fuzzyDateTimestamp(entry.media.startDate)
    case 'length':
      return entry.media.episodes ?? entry.media.chapters ?? 0
    case 'title':
      return 0
  }
}

function titleKey(entry: MediaListEntry): string {
  return (entry.media.title.userPreferred || entry.media.title.romaji || '').toLowerCase()
}

export function sortEntries(entries: MediaListEntry[], key: SortKey): MediaListEntry[] {
  const copy = entries.slice()
  if (key === 'title') {
    copy.sort((a, b) => titleKey(a).localeCompare(titleKey(b)))
    return copy
  }
  copy.sort((a, b) => {
    const av = numericKey(a, key)
    const bv = numericKey(b, key)
    if (av === 0 && bv === 0) return titleKey(a).localeCompare(titleKey(b))
    if (av === 0) return 1
    if (bv === 0) return -1
    return bv - av
  })
  return copy
}
