import type { FuzzyDate, MediaListEntry } from '@/lib/anilist/types'

export type ListView = 'grid' | 'month' | 'year'

export const LIST_VIEWS: ListView[] = ['grid', 'month', 'year']

export function isListView(v: string | null): v is ListView {
  return !!v && (LIST_VIEWS as string[]).includes(v)
}

export interface DateGroup {
  key: string
  label: string
  entries: MediaListEntry[]
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function groupKey(date: FuzzyDate | null | undefined, view: 'month' | 'year'): string {
  if (!date?.year) return 'no-date'
  if (view === 'year') return String(date.year)
  const m = String(date.month ?? 0).padStart(2, '0')
  return `${date.year}-${m}`
}

function groupLabel(key: string, view: 'month' | 'year'): string {
  if (key === 'no-date') return 'No date'
  if (view === 'year') return key
  const [year, monthStr] = key.split('-')
  const m = parseInt(monthStr, 10)
  if (!m) return year
  return `${MONTH_NAMES[m - 1]} ${year}`
}

export function groupEntriesByCompletedDate(
  entries: MediaListEntry[],
  view: 'month' | 'year',
): DateGroup[] {
  const map = new Map<string, MediaListEntry[]>()
  for (const e of entries) {
    const key = groupKey(e.completedAt, view)
    let arr = map.get(key)
    if (!arr) {
      arr = []
      map.set(key, arr)
    }
    arr.push(e)
  }
  const keys = [...map.keys()].sort((a, b) => {
    if (a === 'no-date') return 1
    if (b === 'no-date') return -1
    return b.localeCompare(a)
  })
  return keys.map((key) => ({
    key,
    label: groupLabel(key, view),
    entries: map.get(key)!,
  }))
}
