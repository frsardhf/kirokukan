import type { MediaType } from '@/lib/anilist/types'
import { ALL_MEDIA_TYPES, mediaTypeLabel } from '@/lib/media'
import { cn } from '@/lib/utils'

interface MediaTypeToggleProps {
  value: MediaType
  onChange: (next: MediaType) => void
  className?: string
}

export function MediaTypeToggle({ value, onChange, className }: MediaTypeToggleProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-full border border-border/60 bg-secondary/50 p-0.5',
        className,
      )}
    >
      {ALL_MEDIA_TYPES.map((t) => {
        const active = value === t
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t)}
            className={cn(
              'px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors',
              active
                ? 'bg-foreground text-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {mediaTypeLabel(t)}
          </button>
        )
      })}
    </div>
  )
}
