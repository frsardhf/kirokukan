import { Fragment } from 'react'
import type { MediaListEntry, MediaListStatus, MediaType } from '@/lib/anilist/types'
import { statusLabel } from '@/lib/media'
import { STATUS_BANNER_CLASS } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import { MediaCard } from '@/components/MediaCard'

interface MediaGroup {
  status: MediaListStatus
  entries: MediaListEntry[]
}

interface MediaGridProps {
  entries: MediaListEntry[]
  type: MediaType
  onOpen: (entry: MediaListEntry) => void
  groups?: MediaGroup[] | null
}


const GRID_CLASS =
  'grid gap-3 sm:gap-4 grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]'

export function MediaGrid({ entries, type, onOpen, groups }: MediaGridProps) {
  if (entries.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground text-sm">
        Nothing here yet.
      </div>
    )
  }

  if (groups) {
    return (
      <div className={GRID_CLASS}>
        {groups.map((group, i) => (
          <Fragment key={group.status}>
            <div
              className={cn(
                'col-span-full flex items-center gap-3',
                i > 0 && 'mt-2',
              )}
            >
              <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-md', STATUS_BANNER_CLASS[group.status])}>
                {statusLabel(group.status, type)}
              </span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            {group.entries.map((entry) => (
              <MediaCard key={entry.id} entry={entry} type={type} onOpen={onOpen} />
            ))}
          </Fragment>
        ))}
      </div>
    )
  }

  return (
    <div className={GRID_CLASS}>
      {entries.map((entry) => (
        <MediaCard key={entry.id} entry={entry} type={type} onOpen={onOpen} />
      ))}
    </div>
  )
}
