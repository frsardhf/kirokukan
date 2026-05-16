import { useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import type { MediaType } from '@/lib/anilist/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getSortOptions, type SortKey } from '@/lib/sort'

interface SortControlProps {
  value: SortKey
  type: MediaType
  onChange: (sort: SortKey) => void
  onApplyToAll?: () => void
}

export function SortControl({ value, type, onChange, onApplyToAll }: SortControlProps) {
  const [applied, setApplied] = useState(false)
  const options = useMemo(() => getSortOptions(type), [type])

  useEffect(() => {
    if (!applied) return
    const t = setTimeout(() => setApplied(false), 1500)
    return () => clearTimeout(t)
  }, [applied])

  const handleApply = () => {
    onApplyToAll?.()
    setApplied(true)
  }

  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortKey)}>
      <SelectTrigger className="w-[160px]" size="sm">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
        {onApplyToAll && (
          <>
            <SelectSeparator />
            <button
              type="button"
              onPointerDown={(e) => e.preventDefault()}
              onClick={handleApply}
              className="flex w-full items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground cursor-default select-none"
            >
              {applied
                ? <><Check className="size-3.5" /> Applied to all tabs</>
                : 'Apply to all tabs'
              }
            </button>
          </>
        )}
      </SelectContent>
    </Select>
  )
}
