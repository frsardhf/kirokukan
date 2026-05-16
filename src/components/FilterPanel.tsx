import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { MediaFormat, MediaSeason, MediaStatus, MediaTag, MediaType } from '@/lib/anilist/types'
import type { BrowseFilters } from '@/hooks/useBrowseParams'
import { useGenreCollection } from '@/hooks/useGenreCollection'
import { useTagCollection } from '@/hooks/useTagCollection'
import { useBrowseFilterCount } from '@/hooks/useBrowseFilterCount'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface FilterPanelProps {
  open: boolean
  onClose: () => void
  type: MediaType
  filters: BrowseFilters
  onChange: (next: Partial<BrowseFilters>) => void
  onClear: () => void
}

const FORMATS_ANIME: { value: MediaFormat; label: string }[] = [
  { value: 'TV', label: 'TV' },
  { value: 'TV_SHORT', label: 'TV Short' },
  { value: 'MOVIE', label: 'Movie' },
  { value: 'OVA', label: 'OVA' },
  { value: 'ONA', label: 'ONA' },
  { value: 'SPECIAL', label: 'Special' },
]

const FORMATS_MANGA: { value: MediaFormat; label: string }[] = [
  { value: 'TV', label: 'Manga' },
  { value: 'MOVIE', label: 'Light Novel' },
  { value: 'SPECIAL', label: 'One Shot' },
]

const STATUSES: { value: MediaStatus; label: string }[] = [
  { value: 'RELEASING', label: 'Releasing' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'NOT_YET_RELEASED', label: 'Upcoming' },
  { value: 'HIATUS', label: 'Hiatus' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const SEASONS: { value: MediaSeason; label: string }[] = [
  { value: 'WINTER', label: 'Winter' },
  { value: 'SPRING', label: 'Spring' },
  { value: 'SUMMER', label: 'Summer' },
  { value: 'FALL', label: 'Fall' },
]

export function FilterPanel({ open, onClose, type, filters, onChange, onClear }: FilterPanelProps) {
  const isMobile = useIsMobile()
  const Shell = isMobile ? MobileShell : DesktopShell

  return (
    <Shell open={open} onClose={onClose}>
      <FilterPanelBody
        type={type}
        filters={filters}
        onChange={onChange}
        onClear={onClear}
        onClose={onClose}
      />
    </Shell>
  )
}

function DesktopShell({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton aria-describedby={undefined} className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 sticky top-0 bg-background z-10 border-b border-border/40">
          <DialogTitle className="text-base">Filters</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

function MobileShell({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" aria-describedby={undefined} className="max-h-[90vh] overflow-y-auto p-0 rounded-t-2xl">
        <SheetHeader className="px-4 pt-4 pb-3 sticky top-0 bg-background z-10 border-b border-border/40">
          <SheetTitle className="text-base">Filters</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4">{children}</div>
      </SheetContent>
    </Sheet>
  )
}

function FilterPanelBody({
  type,
  filters,
  onChange,
  onClear,
  onClose,
}: {
  type: MediaType
  filters: BrowseFilters
  onChange: (next: Partial<BrowseFilters>) => void
  onClear: () => void
  onClose: () => void
}) {
  const formats = type === 'ANIME' ? FORMATS_ANIME : FORMATS_MANGA
  const { data: count, isFetching: countLoading } = useBrowseFilterCount(type, filters)

  return (
    <div className="space-y-5">
      {/* Format */}
      <Section title="Format">
        <PillRow
          options={formats}
          value={filters.format}
          onChange={(v) => onChange({ format: v })}
          allowClear
        />
      </Section>

      {/* Status */}
      <Section title="Status">
        <PillRow
          options={STATUSES}
          value={filters.status}
          onChange={(v) => onChange({ status: v })}
          allowClear
        />
      </Section>

      {/* Aired in (year + season) */}
      {type === 'ANIME' && (
        <Section title="Aired in">
          <div className="flex flex-wrap items-center gap-2">
            <YearPicker value={filters.year} onChange={(v) => onChange({ year: v })} />
            <PillRow
              options={SEASONS}
              value={filters.season}
              onChange={(v) => onChange({ season: v })}
              allowClear
            />
          </div>
        </Section>
      )}
      {type === 'MANGA' && (
        <Section title="Year">
          <YearPicker value={filters.year} onChange={(v) => onChange({ year: v })} />
        </Section>
      )}

      {/* Genres */}
      <Section title="Genres">
        <GenresPicker selected={filters.genres} onChange={(v) => onChange({ genres: v })} />
      </Section>

      {/* Tags */}
      <Section title="Tags">
        <TagsPicker selected={filters.tags} onChange={(v) => onChange({ tags: v })} />
      </Section>

      {/* Footer */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-background border-t border-border/40 flex items-center justify-between gap-3 mt-6">
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
        >
          Clear all
        </button>
        <div className="flex items-center gap-3">
          <span className={cn('text-xs text-muted-foreground tabular-nums', countLoading && 'opacity-50')}>
            {count != null ? `${count.toLocaleString()} results` : '—'}
          </span>
          <Button size="sm" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  )
}

interface PillRowProps<T extends string> {
  options: { value: T; label: string }[]
  value: T | null
  onChange: (v: T | null) => void
  allowClear?: boolean
}

function PillRow<T extends string>({ options, value, onChange, allowClear }: PillRowProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(allowClear && active ? null : opt.value)}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-full transition-colors',
              active
                ? 'bg-foreground text-background'
                : 'bg-muted/40 hover:bg-muted text-foreground/70 hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function YearPicker({ value, onChange }: { value: number | null; onChange: (v: number | null) => void }) {
  const [open, setOpen] = useState(false)
  const cur = new Date().getFullYear()
  const years = useMemo(() => {
    const list: number[] = []
    for (let y = cur + 1; y >= 1960; y--) list.push(y)
    return list
  }, [cur])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'px-2.5 py-1 text-xs font-medium rounded-full transition-colors inline-flex items-center gap-1',
            value != null
              ? 'bg-foreground text-background'
              : 'bg-muted/40 hover:bg-muted text-foreground/70 hover:text-foreground',
          )}
        >
          {value != null ? value : 'Any year'}
          {value != null && (
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation()
                onChange(null)
              }}
              className="ml-0.5 -mr-0.5 hover:opacity-80"
              aria-label="Clear year"
            >
              <X className="size-3" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-2">
        <div className="grid grid-cols-5 gap-1 max-h-80 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
          {years.map((y) => {
            const active = value === y
            return (
              <button
                key={y}
                onClick={() => { onChange(y); setOpen(false) }}
                className={cn(
                  'h-8 text-xs rounded-md transition-colors tabular-nums',
                  active
                    ? 'bg-foreground text-background'
                    : 'hover:bg-muted text-foreground/80',
                )}
              >
                {y}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function GenresPicker({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const { data: genres, isLoading } = useGenreCollection()
  if (isLoading) return <SkeletonChips count={12} />
  if (!genres) return null

  const toggle = (g: string) => {
    if (selected.includes(g)) onChange(selected.filter((x) => x !== g))
    else onChange([...selected, g])
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {genres.map((g) => {
        const active = selected.includes(g)
        return (
          <button
            key={g}
            onClick={() => toggle(g)}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-full transition-colors',
              active
                ? 'bg-foreground text-background'
                : 'bg-muted/40 hover:bg-muted text-foreground/70 hover:text-foreground',
            )}
          >
            {g}
          </button>
        )
      })}
    </div>
  )
}

function TagsPicker({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const { data: tags, isLoading } = useTagCollection()
  const [query, setQuery] = useState('')

  const trimmed = query.trim().toLowerCase()
  const grouped = useMemo(() => groupTags(tags ?? [], trimmed), [tags, trimmed])

  if (isLoading) return <SkeletonChips count={10} />
  if (!tags) return null

  const toggle = (name: string) => {
    if (selected.includes(name)) onChange(selected.filter((x) => x !== name))
    else onChange([...selected, name])
  }

  const selectedTagSet = new Set(selected)
  const selectedTags = tags.filter((t) => selectedTagSet.has(t.name))

  return (
    <div className="space-y-2.5">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tags…"
          className="pl-8 h-8 text-xs"
        />
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-border/40">
          {selectedTags.map((t) => (
            <button
              key={t.id}
              onClick={() => toggle(t.name)}
              className="px-2 py-0.5 text-xs font-medium rounded-full bg-foreground text-background inline-flex items-center gap-1"
            >
              {t.name}
              <X className="size-3" />
            </button>
          ))}
        </div>
      )}

      <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
        {grouped.length === 0 && (
          <p className="text-xs text-muted-foreground py-4 text-center">No tags match "{query}"</p>
        )}
        {grouped.map(([category, items]) => (
          <div key={category} className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">{category}</p>
            <div className="flex flex-wrap gap-1">
              {items.map((t) => {
                const active = selectedTagSet.has(t.name)
                return (
                  <button
                    key={t.id}
                    onClick={() => toggle(t.name)}
                    title={t.description ?? undefined}
                    className={cn(
                      'px-2 py-0.5 text-[11px] rounded-full transition-colors',
                      active
                        ? 'bg-foreground text-background'
                        : 'bg-muted/40 hover:bg-muted text-foreground/70 hover:text-foreground',
                    )}
                  >
                    {t.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonChips({ count }: { count: number }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-6 w-16 rounded-full bg-muted/40 animate-pulse" />
      ))}
    </div>
  )
}

function groupTags(tags: MediaTag[], query: string): [string, MediaTag[]][] {
  const matched = query
    ? tags.filter((t) => t.name.toLowerCase().includes(query) || (t.category ?? '').toLowerCase().includes(query))
    : tags
  const map = new Map<string, MediaTag[]>()
  for (const t of matched) {
    const cat = t.category ?? 'Other'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(t)
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
}
