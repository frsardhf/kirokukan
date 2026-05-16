import { Link } from 'react-router-dom'
import type { BrowseMedia, MediaType } from '@/lib/anilist/types'
import { mediaTypeSlug } from '@/lib/media'
import { BrowseCard } from '@/components/BrowseCard'

interface BrowseSectionProps {
  title: string
  media: BrowseMedia[]
  type: MediaType
  variant?: 'full' | 'half'
  hideSeason?: boolean
  hideMeta?: boolean
  viewAllSlug?: string
  onOpen?: (media: BrowseMedia) => void
}

export function BrowseSection({ title, media, type, variant = 'full', hideSeason, hideMeta, viewAllSlug, onOpen }: BrowseSectionProps) {
  if (media.length === 0) return null

  const gridClass =
    variant === 'half'
      ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4'
      : 'grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 sm:gap-4'

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          {title}
        </h2>
        {viewAllSlug && (
          <Link
            to={`/${mediaTypeSlug(type)}/browse/${viewAllSlug}`}
            className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors shrink-0"
          >
            View all →
          </Link>
        )}
        <div className="flex-1 h-px bg-border/40" />
      </div>
      <div className={gridClass}>
        {media.map((m) => (
          <BrowseCard key={m.id} media={m} type={type} hideSeason={hideSeason} hideMeta={hideMeta} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
