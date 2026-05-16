import type {
  FuzzyDate,
  MediaListStatus,
  MediaSeason,
  MediaType,
} from '@/lib/anilist/types'

const SEASON_LABEL: Record<MediaSeason, string> = {
  WINTER: 'Winter',
  SPRING: 'Spring',
  SUMMER: 'Summer',
  FALL: 'Fall',
}

const STATUS_LABEL_ANIME: Record<MediaListStatus, string> = {
  CURRENT: 'Watching',
  PLANNING: 'Planning',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped',
  PAUSED: 'Paused',
  REPEATING: 'Rewatching',
}

const STATUS_LABEL_MANGA: Record<MediaListStatus, string> = {
  CURRENT: 'Reading',
  PLANNING: 'Planning',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped',
  PAUSED: 'Paused',
  REPEATING: 'Rereading',
}

const STATUS_SLUG: Record<MediaListStatus, string> = {
  CURRENT: 'watching',
  PLANNING: 'planning',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
  PAUSED: 'paused',
  REPEATING: 'rewatching',
}

export const ALL_STATUSES: MediaListStatus[] = [
  'CURRENT',
  'COMPLETED',
  'PLANNING',
  'PAUSED',
  'DROPPED',
  'REPEATING',
]

export function statusLabel(s: MediaListStatus, type: MediaType = 'ANIME'): string {
  return type === 'MANGA' ? STATUS_LABEL_MANGA[s] : STATUS_LABEL_ANIME[s]
}

const SHORT_LABEL_ANIME: Partial<Record<MediaListStatus, string>> = {
  CURRENT: 'Watch',
  COMPLETED: 'Done',
  PLANNING: 'Plan',
}

const SHORT_LABEL_MANGA: Partial<Record<MediaListStatus, string>> = {
  CURRENT: 'Read',
  COMPLETED: 'Done',
  PLANNING: 'Plan',
}

export function statusShortLabel(s: MediaListStatus, type: MediaType = 'ANIME'): string {
  const map = type === 'MANGA' ? SHORT_LABEL_MANGA : SHORT_LABEL_ANIME
  return map[s] ?? statusLabel(s, type)
}

export function statusSlug(s: MediaListStatus): string {
  return STATUS_SLUG[s]
}

export function statusFromSlug(slug: string | undefined): MediaListStatus | null {
  if (!slug) return null
  const found = ALL_STATUSES.find((s) => STATUS_SLUG[s] === slug.toLowerCase())
  return found ?? null
}

export type ListTab = 'ALL' | MediaListStatus

export const ALL_TABS: ListTab[] = ['ALL', ...ALL_STATUSES]

const TAB_SLUG: Record<ListTab, string> = { ALL: 'all', ...STATUS_SLUG }

export function tabLabel(t: ListTab, type: MediaType = 'ANIME'): string {
  if (t === 'ALL') return 'All'
  return statusLabel(t, type)
}

export function tabSlug(t: ListTab): string {
  return TAB_SLUG[t]
}

export function tabFromSlug(slug: string | undefined): ListTab | null {
  if (!slug) return null
  return ALL_TABS.find((t) => TAB_SLUG[t] === slug.toLowerCase()) ?? null
}

const TYPE_SLUG: Record<MediaType, string> = {
  ANIME: 'anime',
  MANGA: 'manga',
}

export function mediaTypeSlug(t: MediaType): string {
  return TYPE_SLUG[t]
}

export function mediaTypeFromSlug(slug: string | undefined): MediaType | null {
  if (slug === 'anime') return 'ANIME'
  if (slug === 'manga') return 'MANGA'
  return null
}

export const ALL_MEDIA_TYPES: MediaType[] = ['ANIME', 'MANGA']

export function mediaTypeLabel(t: MediaType): string {
  return t === 'ANIME' ? 'Anime' : 'Manga'
}

export function getCurrentSeason(now: Date = new Date()): { season: MediaSeason; year: number } {
  const m = now.getMonth() + 1
  const year = now.getFullYear()
  if (m <= 3) return { season: 'WINTER', year }
  if (m <= 6) return { season: 'SPRING', year }
  if (m <= 9) return { season: 'SUMMER', year }
  return { season: 'FALL', year }
}

export function getNextSeason(now: Date = new Date()): { season: MediaSeason; year: number } {
  const cur = getCurrentSeason(now)
  const order: MediaSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL']
  const idx = order.indexOf(cur.season)
  if (idx === 3) return { season: 'WINTER', year: cur.year + 1 }
  return { season: order[idx + 1], year: cur.year }
}

export function getPreviousSeason(now: Date = new Date()): { season: MediaSeason; year: number } {
  const cur = getCurrentSeason(now)
  const order: MediaSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL']
  const idx = order.indexOf(cur.season)
  if (idx === 0) return { season: 'FALL', year: cur.year - 1 }
  return { season: order[idx - 1], year: cur.year }
}

export function seasonLabel(season: MediaSeason | null, year: number | null): string {
  if (season && year) return `${SEASON_LABEL[season]} ${year}`
  if (season) return SEASON_LABEL[season]
  if (year) return String(year)
  return ''
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function fuzzyDateLabel(d: FuzzyDate | null | undefined): string {
  if (!d || !d.year) return ''
  if (!d.month) return String(d.year)
  const monthStr = MONTHS[d.month - 1] ?? ''
  if (!d.day) return `${monthStr} ${d.year}`
  return `${monthStr} ${d.day}, ${d.year}`
}

export function fuzzyDateRange(start: FuzzyDate, end: FuzzyDate): string {
  const a = fuzzyDateLabel(start)
  const b = fuzzyDateLabel(end)
  if (a && b) return `${a} – ${b}`
  if (a) return a
  if (b) return b
  return ''
}

export function fuzzyDateToDate(d: FuzzyDate | null | undefined): Date | null {
  if (!d || !d.year) return null
  return new Date(d.year, (d.month ?? 1) - 1, d.day ?? 1)
}

export function dateToFuzzy(d: Date | null | undefined): FuzzyDate {
  if (!d) return { year: null, month: null, day: null }
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
}

export function fuzzyDateTimestamp(d: FuzzyDate | null | undefined): number {
  if (!d || !d.year) return 0
  return new Date(d.year, (d.month ?? 1) - 1, d.day ?? 1).getTime()
}
