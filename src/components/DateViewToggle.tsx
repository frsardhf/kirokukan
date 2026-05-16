import { CalendarDays, CalendarRange, LayoutGrid, Rows3, SlidersHorizontal } from 'lucide-react'
import type { ListView } from '@/lib/dateGroup'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateViewToggleProps {
  view: ListView
  compact: boolean
  onViewChange: (next: ListView) => void
  onCompactChange: (next: boolean) => void
}

const VIEW_OPTIONS: { value: ListView; label: string; Icon: typeof LayoutGrid }[] = [
  { value: 'grid', label: 'Grid', Icon: LayoutGrid },
  { value: 'month', label: 'Month', Icon: CalendarDays },
  { value: 'year', label: 'Year', Icon: CalendarRange },
]

const COMPACT_OPTIONS: { value: boolean; label: string; description: string; Icon: typeof Rows3 }[] = [
  {
    value: false,
    label: 'Banners between groups',
    description: 'Each group breaks the row',
    Icon: Rows3,
  },
  {
    value: true,
    label: 'Inline banners',
    description: 'Cards fill rows, banners span trailing slots',
    Icon: LayoutGrid,
  },
]

export function DateViewToggle({ view, compact, onViewChange, onCompactChange }: DateViewToggleProps) {
  const ActiveIcon = VIEW_OPTIONS.find((o) => o.value === view)?.Icon ?? LayoutGrid

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="View options"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-background px-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ActiveIcon className="size-4" />
          <SlidersHorizontal className="size-3 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60 p-3 space-y-3">
        <div className="space-y-1.5">
          <Label>Group by</Label>
          <div className="grid grid-cols-3 gap-1">
            {VIEW_OPTIONS.map(({ value, label, Icon }) => {
              const active = view === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onViewChange(value)}
                  aria-pressed={active}
                  title={label}
                  className={cn(
                    'inline-flex flex-col items-center justify-center gap-1 py-2 rounded-md border text-xs transition-colors',
                    active
                      ? 'border-foreground bg-accent text-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent/50',
                  )}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {view !== 'grid' && (
          <div className="space-y-1.5 pt-1 border-t border-border/60">
            <Label>Banner</Label>
            <div className="space-y-1">
              {COMPACT_OPTIONS.map(({ value, label, description }) => {
                const active = compact === value
                return (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => onCompactChange(value)}
                    aria-pressed={active}
                    className={cn(
                      'w-full text-left px-2.5 py-1.5 rounded-md border text-xs transition-colors',
                      active
                        ? 'border-foreground bg-accent'
                        : 'border-border hover:bg-accent/50',
                    )}
                  >
                    <div className="font-medium">{label}</div>
                    <div className="text-muted-foreground mt-0.5">{description}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  )
}
