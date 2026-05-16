import { useState } from 'react'
import type { BrowseMedia, MediaType } from '@/lib/anilist/types'
import { seasonLabel } from '@/lib/media'
import { scoreColorClass } from '@/lib/scoreColors'
import { StatusBadge } from '@/components/StatusBadge'
import { cn } from '@/lib/utils'

interface BrowseCardProps {
  media: BrowseMedia
  type: MediaType
  hideSeason?: boolean
  hideMeta?: boolean
  onOpen?: (media: BrowseMedia) => void
}

export function BrowseCard({ media, type, hideSeason, hideMeta, onOpen }: BrowseCardProps) {
  const [loaded, setLoaded] = useState(false)
  const isManga = type === 'MANGA'
  const title = media.title.userPreferred || media.title.romaji || media.title.english || ''
  const coverUrl = media.coverImage.extraLarge ?? media.coverImage.large ?? ''
  const placeholderColor = media.coverImage.color ?? '#1f1f1f'
  const season = isManga || hideSeason ? '' : seasonLabel(media.season, media.seasonYear)
  const lengthValue = hideMeta ? null : (isManga ? media.chapters : media.episodes)
  const lengthUnit = isManga ? 'ch' : 'ep'
  const length = lengthValue != null ? `${lengthValue} ${lengthUnit}` : null
  const scoreValue = hideMeta ? null : media.averageScore

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
      aria-label={title}
      className={cn(
        'group relative w-full overflow-hidden rounded-xl bg-card text-left shadow-sm transition-all',
        'aspect-[2/3]',
        onOpen && 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hover:shadow-xl md:hover:-translate-y-0.5',
      )}
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

      {media.mediaListEntry && (
        <div className="absolute top-2 right-2 z-20">
          <StatusBadge status={media.mediaListEntry.status} type={type} variant="dot" />
        </div>
      )}

      {!hideMeta && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-10">
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-tight drop-shadow">{title}</h3>
          {(season || length || scoreValue != null) && (
            <p className="mt-1 text-[11px] text-white/70">
              {[length, season].filter(Boolean).join(' · ')}
              {scoreValue != null && (length || season) && ' · '}
              {scoreValue != null && (
                <span className={scoreColorClass(scoreValue)}>{scoreValue}%</span>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
