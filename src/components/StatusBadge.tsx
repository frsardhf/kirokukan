import type { MediaListStatus, MediaType } from '@/lib/anilist/types'
import { statusLabel } from '@/lib/media'
import { STATUS_BADGE_CLASS, STATUS_DOT_CLASS } from '@/lib/statusColors'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: MediaListStatus
  type?: MediaType
  variant?: 'badge' | 'dot'
  className?: string
}

export function StatusBadge({ status, type = 'ANIME', variant = 'badge', className }: StatusBadgeProps) {
  if (variant === 'dot') {
    return (
      <span
        className={cn('inline-block size-3 rounded-full ring-2 ring-background/70 shadow-sm', STATUS_DOT_CLASS[status], className)}
        aria-label={statusLabel(status, type)}
      />
    )
  }

  return (
    <span
      className={cn(
        'inline-flex h-4 items-center rounded-full px-1.5 text-[10px] font-medium leading-none uppercase backdrop-blur-sm',
        STATUS_BADGE_CLASS[status],
        className,
      )}
    >
      {statusLabel(status, type)}
    </span>
  )
}
