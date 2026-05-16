import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { BrowseMedia, MediaType } from '@/lib/anilist/types'
import { mediaTypeSlug } from '@/lib/media'
import { scoreColorClass } from '@/lib/scoreColors'
import { StatusBadge } from '@/components/StatusBadge'
import { cn } from '@/lib/utils'

interface Top100GridProps {
  media: BrowseMedia[]
  type: MediaType
  onOpen?: (media: BrowseMedia) => void
}

export function Top100Grid({ media, type, onOpen }: Top100GridProps) {
  if (media.length === 0) return null
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Top 100 {type === 'ANIME' ? 'Anime' : 'Manga'}
        </h2>
        <Link
          to={`/${mediaTypeSlug(type)}/browse/top-rated`}
          className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors shrink-0"
        >
          View all →
        </Link>
        <div className="flex-1 h-px bg-border/40" />
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
        {media.map((m, i) => (
          <Top100Tile key={m.id} media={m} rank={i + 1} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}

function Top100Tile({ media, rank, onOpen }: { media: BrowseMedia; rank: number; onOpen?: (m: BrowseMedia) => void }) {
  const [loaded, setLoaded] = useState(false)
  const title = media.title.userPreferred || media.title.romaji || media.title.english || ''
  const coverUrl = media.coverImage.large ?? media.coverImage.extraLarge ?? ''
  const placeholderColor = media.coverImage.color ?? '#1f1f1f'

  return (
    <div
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen ? () => onOpen(media) : undefined}
      onKeyDown={
        onOpen
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpen(media)
              }
            }
          : undefined
      }
      aria-label={`#${rank} ${title}`}
      className={cn(
        'group flex flex-col gap-1.5',
        onOpen && 'cursor-pointer focus-visible:outline-none',
      )}
    >
      <div
        className="relative w-full aspect-[2/3] overflow-hidden rounded-md bg-card transition-all md:group-hover:ring-2 md:group-hover:ring-ring"
        style={{ backgroundColor: placeholderColor }}
      >
        {coverUrl && (
          <img
            src={coverUrl}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={cn(
              'absolute inset-0 size-full object-cover transition-opacity duration-500',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
          />
        )}
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent px-1.5 py-1">
          <span className="text-base sm:text-lg font-bold leading-none text-white drop-shadow">
            #{rank}
          </span>
        </div>
        {media.mediaListEntry && (
          <div className="absolute top-1.5 right-1.5 z-20">
            <StatusBadge status={media.mediaListEntry.status} variant="dot" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] leading-tight text-foreground truncate">{title}</p>
        {media.averageScore != null && (
          <p className={cn('text-[10px]', scoreColorClass(media.averageScore))}>{media.averageScore}%</p>
        )}
      </div>
    </div>
  )
}
