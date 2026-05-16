import type { MediaListEntry, MediaListStatus, MediaType } from '@/lib/anilist/types'
import { dateToFuzzy, statusLabel, statusShortLabel } from '@/lib/media'
import { Button } from '@/components/ui/button'
import { useUpdateEntry } from '@/hooks/useUpdateEntry'
import { cn } from '@/lib/utils'

const QUICK_STATUSES: MediaListStatus[] = ['PLANNING', 'CURRENT', 'COMPLETED']

interface QuickStatusButtonsProps {
  entry: MediaListEntry
  type: MediaType
  variant?: 'overlay' | 'inline'
  className?: string
}

export function QuickStatusButtons({
  entry,
  type,
  variant = 'overlay',
  className,
}: QuickStatusButtonsProps) {
  const update = useUpdateEntry()

  const handle = (status: MediaListStatus) => {
    if (status === entry.status) return
    const patch: Parameters<typeof update.mutate>[0] = { entry, status }
    const today = dateToFuzzy(new Date())
    if (status === 'CURRENT') {
      if (!entry.startedAt?.year) patch.startedAt = today
    } else if (status === 'COMPLETED') {
      if (!entry.completedAt?.year) patch.completedAt = today
      const total = type === 'MANGA' ? entry.media.chapters : entry.media.episodes
      if (total && entry.progress < total) {
        patch.progress = total
      }
    }
    update.mutate(patch)
  }

  return (
    <div className={cn('grid grid-cols-3 gap-1', className)}>
      {QUICK_STATUSES.map((s) => {
        const active = entry.status === s
        const label = variant === 'overlay' ? statusShortLabel(s, type) : statusLabel(s, type)
        return (
          <Button
            key={s}
            type="button"
            size="xs"
            variant={variant === 'overlay' ? 'ghost' : active ? 'default' : 'outline'}
            disabled={active}
            title={statusLabel(s, type)}
            className={cn(
              'min-w-0 px-1',
              variant === 'overlay' && 'bg-white/15 text-white hover:bg-white/30 text-[11px]',
              active && 'opacity-60',
            )}
            onClick={(e) => {
              e.stopPropagation()
              handle(s)
            }}
          >
            {label}
          </Button>
        )
      })}
    </div>
  )
}
