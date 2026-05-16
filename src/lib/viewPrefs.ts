import type { MediaType } from '@/lib/anilist/types'
import { isListView, type ListView } from '@/lib/dateGroup'

function viewKey(type: MediaType) {
  return `kirokukan.completed.view.${type.toLowerCase()}`
}

function compactKey(type: MediaType) {
  return `kirokukan.completed.compact.${type.toLowerCase()}`
}

export function getStoredView(type: MediaType): ListView | null {
  try {
    const v = localStorage.getItem(viewKey(type))
    return isListView(v) ? v : null
  } catch {
    return null
  }
}

export function setStoredView(type: MediaType, view: ListView) {
  try {
    localStorage.setItem(viewKey(type), view)
  } catch {
    /* ignore */
  }
}

export function getStoredCompact(type: MediaType): boolean {
  try {
    return localStorage.getItem(compactKey(type)) === '1'
  } catch {
    return false
  }
}

export function setStoredCompact(type: MediaType, compact: boolean) {
  try {
    if (compact) localStorage.setItem(compactKey(type), '1')
    else localStorage.removeItem(compactKey(type))
  } catch {
    /* ignore */
  }
}
