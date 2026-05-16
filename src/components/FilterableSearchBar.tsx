import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { MediaSort, MediaType } from '@/lib/anilist/types'
import type { BrowseFilters } from '@/hooks/useBrowseParams'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FilterableSearchBarProps {
  type: MediaType
  filters: BrowseFilters
  onChange: (next: Partial<BrowseFilters>) => void
  onOpenFilters: () => void
  activeCount: number
}

const SORT_LABELS: Record<MediaSort, string> = {
  POPULARITY_DESC: 'Popularity',
  TRENDING_DESC: 'Trending',
  SCORE_DESC: 'Score',
  FAVOURITES_DESC: 'Favorites',
  START_DATE_DESC: 'Newest',
  UPDATED_AT_DESC: 'Updated',
  SEARCH_MATCH: 'Match',
}

export function FilterableSearchBar({ type, filters, onChange, onOpenFilters, activeCount }: FilterableSearchBarProps) {
  const [local, setLocal] = useState(filters.search)

  useEffect(() => {
    if (document.activeElement?.tagName !== 'INPUT') {
      setLocal(filters.search)
    }
  }, [filters.search])

  const commitSearch = (val: string) => {
    onChange({ search: val })
  }

  const chips: { key: string; label: string; remove: () => void }[] = []
  filters.genres.forEach((g) => chips.push({
    key: `g-${g}`,
    label: g,
    remove: () => onChange({ genres: filters.genres.filter((x) => x !== g) }),
  }))
  filters.tags.forEach((t) => chips.push({
    key: `t-${t}`,
    label: t,
    remove: () => onChange({ tags: filters.tags.filter((x) => x !== t) }),
  }))
  if (filters.year) chips.push({
    key: 'year',
    label: String(filters.year),
    remove: () => onChange({ year: null }),
  })
  if (filters.season) chips.push({
    key: 'season',
    label: filters.season.charAt(0) + filters.season.slice(1).toLowerCase(),
    remove: () => onChange({ season: null }),
  })
  if (filters.format) chips.push({
    key: 'format',
    label: filters.format.replace(/_/g, ' '),
    remove: () => onChange({ format: null }),
  })
  if (filters.status) chips.push({
    key: 'status',
    label: filters.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
    remove: () => onChange({ status: null }),
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-0 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitSearch(local)
            }}
            onBlur={() => commitSearch(local)}
            placeholder={`Search ${type === 'ANIME' ? 'anime' : 'manga'}…`}
            className="pl-9 pr-9 h-10 text-base"
          />
          {local && (
            <button
              type="button"
              onClick={() => { setLocal(''); commitSearch('') }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <button
          onClick={onOpenFilters}
          className={cn(
            'inline-flex items-center gap-1.5 h-10 px-3 rounded-md text-sm font-medium transition-colors shrink-0',
            activeCount > 0
              ? 'bg-foreground text-background'
              : 'bg-muted/60 hover:bg-muted text-foreground/80',
          )}
        >
          <SlidersHorizontal className="size-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <span className="text-xs tabular-nums">· {activeCount}</span>
          )}
        </button>

        <Select value={filters.sort} onValueChange={(v) => onChange({ sort: v as MediaSort })}>
          <SelectTrigger size="default" className="w-[140px] !h-10 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABELS) as MediaSort[])
              .filter((s) => s !== 'SEARCH_MATCH')
              .map((s) => (
                <SelectItem key={s} value={s}>{SORT_LABELS[s]}</SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={chip.remove}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-muted/60 hover:bg-muted text-foreground/80 transition-colors"
            >
              {chip.label}
              <X className="size-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
