import type { MediaType } from '@/lib/anilist/types'
import { ALL_TABS, type ListTab } from '@/lib/media'
import { SORT_KEYS, type SortKey } from '@/lib/sort'

function key(type: MediaType, tab: ListTab) {
  return `kiroku.sort.${type.toLowerCase()}.${tab.toLowerCase()}`
}

function isSortKey(v: unknown): v is SortKey {
  return typeof v === 'string' && (SORT_KEYS as string[]).includes(v)
}

export function getStoredSort(type: MediaType, tab: ListTab): SortKey | null {
  try {
    const v = localStorage.getItem(key(type, tab))
    return isSortKey(v) ? v : null
  } catch {
    return null
  }
}

export function setStoredSort(type: MediaType, tab: ListTab, sort: SortKey) {
  try {
    localStorage.setItem(key(type, tab), sort)
  } catch {
    /* ignore */
  }
}

export function setStoredSortForAllTabs(type: MediaType, sort: SortKey) {
  for (const tab of ALL_TABS) {
    setStoredSort(type, tab, sort)
  }
}
