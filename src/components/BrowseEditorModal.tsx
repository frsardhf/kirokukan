import { useMemo } from 'react'
import type { MediaType } from '@/lib/anilist/types'
import { draftEntry } from '@/lib/entryForm'
import { useMediaWithEntry } from '@/hooks/useMediaWithEntry'
import { MediaEditorModal, type MediaEditorNav } from '@/components/MediaEditorModal'

// Only id + type are read for fetching and prev/next nav, so any media-like
// shape works (BrowseMedia from browse grids, Media from a user's list).
type NavItem = { id: number; type: MediaType }

interface BrowseEditorModalProps {
  mediaId: number | null
  navList: NavItem[]
  onNavigate: (id: number) => void
  onClose: () => void
}

export function BrowseEditorModal({ mediaId, navList, onNavigate, onClose }: BrowseEditorModalProps) {
  const type = navList[0]?.type ?? 'ANIME'
  const { data, isLoading } = useMediaWithEntry(mediaId, type)

  const entry = useMemo(() => {
    if (!data) return null
    return data.entry ?? draftEntry(data.media)
  }, [data])
  const isNew = !!data && !data.entry

  const nav = useMemo<MediaEditorNav | undefined>(() => {
    if (mediaId == null) return undefined
    const idx = navList.findIndex((m) => m.id === mediaId)
    if (idx === -1) return undefined
    return {
      index: idx,
      total: navList.length,
      canPrev: idx > 0,
      canNext: idx < navList.length - 1,
      onPrev: () => {
        const target = navList[idx - 1]
        if (target) onNavigate(target.id)
      },
      onNext: () => {
        const target = navList[idx + 1]
        if (target) onNavigate(target.id)
      },
    }
  }, [mediaId, navList, onNavigate])

  return (
    <MediaEditorModal
      open={mediaId != null}
      entry={entry}
      isNew={isNew}
      isLoading={isLoading}
      nav={nav}
      onClose={onClose}
    />
  )
}
