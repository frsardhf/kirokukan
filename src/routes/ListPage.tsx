import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ExternalLink, Search } from 'lucide-react'
import type { MediaListEntry } from '@/lib/anilist/types'
import { ALL_STATUSES, ALL_TABS, mediaTypeSlug, type ListTab } from '@/lib/media'
import { sortEntries } from '@/lib/sort'
import { groupEntriesByCompletedDate } from '@/lib/dateGroup'
import { useAuth } from '@/hooks/useAuth'
import { useMediaList } from '@/hooks/useMediaList'
import { useListParams } from '@/hooks/useListParams'
import { Header } from '@/components/Header'
import { StatusTabs } from '@/components/StatusTabs'
import { SortControl } from '@/components/SortControl'
import { DateViewToggle } from '@/components/DateViewToggle'
import { MediaGrid, type MediaSection } from '@/components/MediaGrid'
import { ListEditorModal } from '@/components/ListEditorModal'
import { BrowseEditorModal } from '@/components/BrowseEditorModal'
import { ErrorState } from '@/components/ErrorState'
import { Input } from '@/components/ui/input'

function matchesSearch(entry: MediaListEntry, query: string): boolean {
  const q = query.toLowerCase()
  const { title } = entry.media
  return (
    title.userPreferred?.toLowerCase().includes(q) ||
    title.romaji?.toLowerCase().includes(q) ||
    title.english?.toLowerCase().includes(q) ||
    false
  )
}

export function ListPage() {
  const { isAuthenticated } = useAuth()
  const {
    username,
    type,
    tab,
    sort,
    view,
    compact,
    setTab,
    setType,
    setSort,
    setView,
    setCompact,
    applyToAllTabs,
  } = useListParams()
  const isOtherUser = !!username
  const { entries: allEntries, byStatus, isLoading, isError, error, refetch } = useMediaList(
    type,
    username,
  )
  // Self mode edits by entry id (ListEditorModal); other-user mode edits YOUR
  // own entry by media id (BrowseEditorModal), so it tracks two open targets.
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingMediaId, setEditingMediaId] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { setSearch('') }, [type])

  const counts = useMemo(() => {
    const c = {} as Record<ListTab, number>
    c.ALL = allEntries.length
    for (const s of ALL_STATUSES) c[s] = byStatus[s]?.length ?? 0
    for (const t of ALL_TABS) if (c[t] == null) c[t] = 0
    return c
  }, [byStatus, allEntries])

  const sections = useMemo<MediaSection[] | null>(() => {
    if (tab !== 'ALL') return null
    const q = search.trim()
    const out: MediaSection[] = []
    for (const s of ALL_STATUSES) {
      const sorted = sortEntries(byStatus[s] ?? [], sort)
      const filtered = q ? sorted.filter((e) => matchesSearch(e, q)) : sorted
      if (filtered.length === 0) continue
      // Mirror the Completed tab: date-subdivide the Completed block when a
      // month/year view is active. Other statuses stay flat.
      if (s === 'COMPLETED' && view !== 'grid') {
        out.push({ status: s, kind: 'dated', dateGroups: groupEntriesByCompletedDate(filtered, view) })
      } else {
        out.push({ status: s, kind: 'flat', entries: filtered })
      }
    }
    return out
  }, [tab, byStatus, sort, search, view])

  const entries = useMemo(() => {
    if (tab === 'ALL') {
      // Flatten in render order so editor arrow-nav and the "1/N" counter
      // match what's on screen (the Completed block reorders when dated).
      return (
        sections?.flatMap((sec) =>
          sec.kind === 'flat' ? sec.entries : sec.dateGroups.flatMap((g) => g.entries),
        ) ?? []
      )
    }
    const sorted = sortEntries(byStatus[tab] ?? [], sort)
    const q = search.trim()
    return q ? sorted.filter((e) => matchesSearch(e, q)) : sorted
  }, [tab, sections, byStatus, sort, search])

  const dateGroups = useMemo(() => {
    if (tab !== 'COMPLETED' || view === 'grid') return null
    return groupEntriesByCompletedDate(entries, view)
  }, [tab, view, entries])

  const editingEntry = useMemo(
    () => (editingId == null ? null : entries.find((e) => e.id === editingId) ?? null),
    [editingId, entries],
  )

  const openEntry = useCallback(
    (entry: MediaListEntry) => {
      if (isOtherUser) setEditingMediaId(entry.mediaId)
      else setEditingId(entry.id)
    },
    [isOtherUser],
  )
  const closeEntry = useCallback(() => {
    setEditingId(null)
    setEditingMediaId(null)
  }, [])

  const navMedia = useMemo(() => entries.map((e) => e.media), [entries])

  // Anonymous users may view any public list, but a signed-out user has no
  // own list to land on — send them to browse.
  if (!isOtherUser && !isAuthenticated)
    return <Navigate to={`/${mediaTypeSlug(type)}/browse`} replace />

  return (
    <div className="min-h-screen flex flex-col">
      <Header type={type} onTypeChange={setType} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 py-5 sm:py-7">
        {isOtherUser && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2">
            <p className="text-sm">
              Viewing{' '}
              <span className="font-semibold">{username}</span>
              <span className="text-muted-foreground">’s list</span>
            </p>
            <a
              href={`https://anilist.co/user/${username}/animelist`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Open on AniList
              <ExternalLink className="size-3" />
            </a>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <StatusTabs tab={tab} type={type} counts={counts} onChange={setTab} />
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-8 w-36 sm:w-44 h-8 text-sm"
              />
            </div>
            {tab === 'COMPLETED' && (
              <DateViewToggle
                view={view}
                compact={compact}
                onViewChange={setView}
                onCompactChange={setCompact}
              />
            )}
            <SortControl
              value={sort}
              type={type}
              onChange={setSort}
              onApplyToAll={applyToAllTabs}
            />
          </div>
        </div>

        {isLoading ? (
          <SkeletonGrid />
        ) : isError ? (
          <ErrorState
            error={error}
            message={isOtherUser ? "Couldn't load this list. It may be private or not exist." : "Couldn't load your list."}
            onRetry={() => refetch()}
          />
        ) : (
          <MediaGrid
            entries={entries}
            type={type}
            onOpen={openEntry}
            sections={sections}
            dateGroups={dateGroups}
            compact={compact}
          />
        )}
      </main>

      {isOtherUser ? (
        <BrowseEditorModal
          mediaId={editingMediaId}
          navList={navMedia}
          onNavigate={setEditingMediaId}
          onClose={closeEntry}
        />
      ) : (
        <ListEditorModal
          entry={editingEntry}
          entries={entries}
          onNavigate={setEditingId}
          onClose={closeEntry}
        />
      )}
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="aspect-[2/3] rounded-xl bg-muted/40 animate-pulse" />
      ))}
    </div>
  )
}

