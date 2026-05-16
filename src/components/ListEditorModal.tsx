import { useMemo } from 'react'
import type { MediaListEntry } from '@/lib/anilist/types'
import { MediaEditorModal, type MediaEditorNav } from '@/components/MediaEditorModal'

interface ListEditorModalProps {
  entry: MediaListEntry | null
  entries: MediaListEntry[]
  onNavigate: (id: number) => void
  onClose: () => void
}

export function ListEditorModal({ entry, entries, onNavigate, onClose }: ListEditorModalProps) {
  const nav = useMemo<MediaEditorNav | undefined>(() => {
    if (!entry) return undefined
    const idx = entries.findIndex((e) => e.id === entry.id)
    if (idx === -1) return undefined
    return {
      index: idx,
      total: entries.length,
      canPrev: idx > 0,
      canNext: idx < entries.length - 1,
      onPrev: () => {
        const target = entries[idx - 1]
        if (target) onNavigate(target.id)
      },
      onNext: () => {
        const target = entries[idx + 1]
        if (target) onNavigate(target.id)
      },
    }
  }, [entry, entries, onNavigate])

  return (
    <MediaEditorModal
      open={!!entry}
      entry={entry}
      nav={nav}
      onClose={onClose}
    />
  )
}
