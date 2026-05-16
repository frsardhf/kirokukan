import { useEffect, useRef } from 'react'
import type { BrowseMedia, MediaType } from '@/lib/anilist/types'
import { BrowseCard } from '@/components/BrowseCard'

interface InfiniteGridProps {
  media: BrowseMedia[]
  type: MediaType
  onOpen?: (media: BrowseMedia) => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

export function InfiniteGrid({ media, type, onOpen, hasNextPage, isFetchingNextPage, fetchNextPage }: InfiniteGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 sm:gap-4">
        {media.map((m) => (
          <BrowseCard key={m.id} media={m} type={type} onOpen={onOpen} />
        ))}
      </div>

      <div ref={sentinelRef} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <div className="flex gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        )}
        {!hasNextPage && media.length > 0 && (
          <p className="text-xs text-muted-foreground/50">End of results</p>
        )}
      </div>
    </div>
  )
}
