import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react'
import type { BrowseMedia, MediaType } from '@/lib/anilist/types'
import { mediaTypeSlug } from '@/lib/media'
import { useMediaSearch } from '@/hooks/useMediaSearch'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/StatusBadge'
import { cn } from '@/lib/utils'

interface BrowseSearchProps {
  type: MediaType
  onOpen?: (media: BrowseMedia) => void
}

export function BrowseSearch({ type, onOpen }: BrowseSearchProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const { data: results, isFetching } = useMediaSearch(query, type)

  // Reset when type changes
  useEffect(() => { setQuery('') }, [type])

  // Esc to clear
  useEffect(() => {
    if (!query) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuery('')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [query])

  const trimmed = query.trim()
  const showOverlay = trimmed.length > 0 && focused

  return (
    <>
      {showOverlay && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onMouseDown={() => setFocused(false)}
          aria-hidden
        />
      )}
      <div className="relative z-40">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder={`Search ${type === 'ANIME' ? 'anime' : 'manga'}…`}
              className="pl-9 pr-9 h-10 text-base"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
            {isFetching && (
              <Loader2 className="absolute right-9 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <Link
            to={`/${mediaTypeSlug(type)}/browse/search`}
            className="inline-flex items-center gap-1.5 h-10 px-3 rounded-md text-sm font-medium bg-muted/60 hover:bg-muted text-foreground/80 transition-colors shrink-0"
          >
            <SlidersHorizontal className="size-4" />
            <span className="hidden sm:inline">Filters</span>
          </Link>
        </div>

        {trimmed.length > 0 && (
          <div
            className={cn(
              'absolute left-0 right-0 top-full mt-2 max-h-[60vh] overflow-y-auto rounded-lg border border-border bg-popover shadow-lg',
              !focused && 'hidden',
            )}
          >
            {results && results.length === 0 && !isFetching && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No results for "{trimmed}"
              </div>
            )}
            {results && results.length > 0 && (
              <ul className="py-1">
                {results.map((m) => (
                  <SearchResultRow
                    key={m.id}
                    media={m}
                    type={type}
                    onClick={() => {
                      if (onOpen) onOpen(m)
                      setQuery('')
                      setFocused(false)
                    }}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function SearchResultRow({ media, type, onClick }: { media: BrowseMedia; type: MediaType; onClick: () => void }) {
  const title = media.title.userPreferred || media.title.romaji || media.title.english || ''
  const cover = media.coverImage.large ?? media.coverImage.extraLarge ?? ''
  const meta = [media.format, media.seasonYear].filter(Boolean).join(' · ')
  return (
    <li>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent"
      >
        <div
          className="shrink-0 w-10 h-14 rounded overflow-hidden bg-muted"
          style={{ backgroundColor: media.coverImage.color ?? '#1f1f1f' }}
        >
          {cover && <img src={cover} alt="" loading="lazy" decoding="async" className="size-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{title}</p>
          {meta && <p className="text-xs text-muted-foreground truncate">{meta}</p>}
        </div>
        {media.mediaListEntry && (
          <div className="shrink-0">
            <StatusBadge status={media.mediaListEntry.status} type={type} />
          </div>
        )}
      </button>
    </li>
  )
}
