import type { MediaType } from '@/lib/anilist/types'
import { getPresetsForType } from '@/lib/browsePresets'

interface PresetChipStripProps {
  type: MediaType
  onApply: (params: Record<string, string>) => void
}

export function PresetChipStrip({ type, onApply }: PresetChipStripProps) {
  const presets = getPresetsForType(type)
  if (presets.length === 0) return null

  return (
    <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      {presets.map((p) => (
        <button
          key={p.id}
          onClick={() => onApply(p.getParams())}
          className="shrink-0 px-2.5 py-1 text-xs font-medium rounded-full bg-muted/40 hover:bg-muted text-foreground/70 hover:text-foreground transition-colors whitespace-nowrap"
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
