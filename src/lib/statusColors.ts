import type { MediaListStatus } from '@/lib/anilist/types'

export const STATUS_BADGE_CLASS: Record<MediaListStatus, string> = {
  CURRENT:   'bg-sky-500/85 text-white',
  COMPLETED: 'bg-emerald-500/85 text-white',
  PLANNING:  'bg-violet-500/85 text-white',
  PAUSED:    'bg-amber-500/85 text-white',
  DROPPED:   'bg-rose-500/85 text-white',
  REPEATING: 'bg-fuchsia-500/85 text-white',
}

export const STATUS_DOT_CLASS: Record<MediaListStatus, string> = {
  CURRENT:   'bg-sky-400',
  COMPLETED: 'bg-emerald-400',
  PLANNING:  'bg-violet-400',
  PAUSED:    'bg-amber-400',
  DROPPED:   'bg-rose-400',
  REPEATING: 'bg-fuchsia-400',
}

export const STATUS_BANNER_CLASS: Record<MediaListStatus, string> = {
  CURRENT:   'bg-sky-500/25 text-sky-400',
  COMPLETED: 'bg-emerald-500/25 text-emerald-400',
  PLANNING:  'bg-violet-500/25 text-violet-400',
  PAUSED:    'bg-amber-500/25 text-amber-400',
  DROPPED:   'bg-rose-500/25 text-rose-400',
  REPEATING: 'bg-fuchsia-500/25 text-fuchsia-400',
}
