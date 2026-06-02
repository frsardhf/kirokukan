import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { MediaListEntry, MediaListStatus, MediaType } from '@/lib/anilist/types'
import { statusLabel } from '@/lib/media'
import { STATUS_BANNER_CLASS } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import { MediaCard } from '@/components/MediaCard'
import type { DateGroup } from '@/lib/dateGroup'

interface FlatSection {
  status: MediaListStatus
  kind: 'flat'
  entries: MediaListEntry[]
}

interface DatedSection {
  status: MediaListStatus
  kind: 'dated'
  dateGroups: DateGroup[]
}

export type MediaSection = FlatSection | DatedSection

interface MediaGridProps {
  entries: MediaListEntry[]
  type: MediaType
  onOpen: (entry: MediaListEntry) => void
  sections?: MediaSection[] | null
  dateGroups?: DateGroup[] | null
  compact?: boolean
}


const GRID_CLASS =
  'grid gap-3 sm:gap-4 grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]'

export function MediaGrid({ entries, type, onOpen, sections, dateGroups, compact = false }: MediaGridProps) {
  if (entries.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground text-sm">
        Nothing here yet.
      </div>
    )
  }

  // Completed tab: the whole list is date-grouped.
  if (dateGroups) {
    return compact ? (
      <InlineBannerGrid dateGroups={dateGroups} type={type} onOpen={onOpen} />
    ) : (
      <FullWidthDateGrid dateGroups={dateGroups} type={type} onOpen={onOpen} />
    )
  }

  // All tab: one block per status. The Completed block may be date-subdivided,
  // honoring the same view/compact settings as the Completed tab.
  if (sections) {
    return (
      <div className="space-y-6">
        {sections.map((sec) => (
          <section key={sec.status}>
            <div className="flex items-center gap-3 mb-4">
              <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-md', STATUS_BANNER_CLASS[sec.status])}>
                {statusLabel(sec.status, type)}
              </span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            {sec.kind === 'flat' ? (
              <FlatGrid entries={sec.entries} type={type} onOpen={onOpen} />
            ) : compact ? (
              <InlineBannerGrid dateGroups={sec.dateGroups} type={type} onOpen={onOpen} />
            ) : (
              <FullWidthDateGrid dateGroups={sec.dateGroups} type={type} onOpen={onOpen} />
            )}
          </section>
        ))}
      </div>
    )
  }

  return <FlatGrid entries={entries} type={type} onOpen={onOpen} />
}

interface GridSliceProps {
  type: MediaType
  onOpen: (entry: MediaListEntry) => void
}

function FlatGrid({ entries, type, onOpen }: GridSliceProps & { entries: MediaListEntry[] }) {
  return (
    <div className={GRID_CLASS}>
      {entries.map((entry) => (
        <MediaCard key={entry.id} entry={entry} type={type} onOpen={onOpen} />
      ))}
    </div>
  )
}

function FullWidthDateGrid({ dateGroups, type, onOpen }: GridSliceProps & { dateGroups: DateGroup[] }) {
  return (
    <div className={GRID_CLASS}>
      {dateGroups.map((g, i) => (
        <Fragment key={g.key}>
          <div className={cn('col-span-full flex items-baseline gap-2.5', i > 0 && 'mt-4')}>
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              {g.label}
            </h3>
            <span className="text-xs font-medium text-muted-foreground tabular-nums">
              {g.entries.length}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          {g.entries.map((entry) => (
            <MediaCard key={entry.id} entry={entry} type={type} onOpen={onOpen} />
          ))}
        </Fragment>
      ))}
    </div>
  )
}

interface InlineBannerGridProps {
  dateGroups: DateGroup[]
  type: MediaType
  onOpen: (entry: MediaListEntry) => void
}

interface FlatItem {
  entry: MediaListEntry
  isFirstInGroup: boolean
  groupLabel: string
  groupCount: number
}

function InlineBannerGrid({ dateGroups, type, onOpen }: InlineBannerGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [cols, setCols] = useState(5)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const tracks = getComputedStyle(el)
        .getPropertyValue('grid-template-columns')
        .split(' ')
        .filter(Boolean)
      const n = Math.max(1, tracks.length)
      setCols((prev) => (prev !== n ? n : prev))
    }
    update()
    const obs = new ResizeObserver(update)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const flat = useMemo<FlatItem[]>(() => {
    const out: FlatItem[] = []
    for (const g of dateGroups) {
      g.entries.forEach((entry, i) => {
        out.push({
          entry,
          isFirstInGroup: i === 0,
          groupLabel: g.label,
          groupCount: g.entries.length,
        })
      })
    }
    return out
  }, [dateGroups])

  const rows = useMemo<FlatItem[][]>(() => {
    const out: FlatItem[][] = []
    for (let i = 0; i < flat.length; i += cols) {
      out.push(flat.slice(i, i + cols))
    }
    return out
  }, [flat, cols])

  return (
    <div ref={ref} className={GRID_CLASS}>
      {rows.map((row, rowIdx) => {
        const labels = row.flatMap((item, colIdx) =>
          item.isFirstInGroup
            ? [{ col: colIdx, text: item.groupLabel, count: item.groupCount }]
            : [],
        )
        return (
          <Fragment key={rowIdx}>
            {labels.length > 0 && (
              <div className="col-span-full grid grid-cols-subgrid gap-3 sm:gap-4">
                {labels.map((label, i) => {
                  const startCol = label.col + 1
                  const endCol = labels[i + 1] ? labels[i + 1].col + 1 : cols + 1
                  return (
                    <div
                      key={label.col}
                      className="flex items-baseline gap-2.5 min-w-0"
                      style={{ gridColumn: `${startCol} / ${endCol}` }}
                    >
                      <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight whitespace-nowrap">
                        {label.text}
                      </h3>
                      <span className="text-xs font-medium text-muted-foreground tabular-nums">
                        {label.count}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  )
                })}
              </div>
            )}
            {row.map(({ entry }) => (
              <MediaCard key={entry.id} entry={entry} type={type} onOpen={onOpen} />
            ))}
          </Fragment>
        )
      })}
    </div>
  )
}

