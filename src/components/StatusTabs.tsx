import type { MediaType } from '@/lib/anilist/types'
import { ALL_TABS, tabLabel, type ListTab } from '@/lib/media'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface StatusTabsProps {
  tab: ListTab
  type: MediaType
  counts: Record<ListTab, number>
  onChange: (tab: ListTab) => void
}

export function StatusTabs({ tab, type, counts, onChange }: StatusTabsProps) {
  return (
    <Tabs value={tab} onValueChange={(v) => onChange(v as ListTab)} className="w-full">
      <TabsList className="overflow-x-auto no-scrollbar w-full justify-start sm:w-auto">
        {ALL_TABS.map((t) => (
          <TabsTrigger key={t} value={t} className="whitespace-nowrap">
            {tabLabel(t, type)}
            <span className="ml-1.5 text-xs text-muted-foreground">{counts[t] ?? 0}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
