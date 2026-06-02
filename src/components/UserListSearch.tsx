import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, UserRound } from 'lucide-react'
import type { MediaType } from '@/lib/anilist/types'
import { mediaTypeSlug } from '@/lib/media'
import { Input } from '@/components/ui/input'

interface UserListSearchProps {
  type: MediaType
}

// Jump to any public AniList user's list by username. No auth required —
// AniList serves public lists by name.
export function UserListSearch({ type }: UserListSearchProps) {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const go = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    navigate(`/${mediaTypeSlug(type)}/user/${encodeURIComponent(trimmed)}/list/all`)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 min-w-0">
        <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') go()
          }}
          placeholder="View an AniList user's list…"
          className="pl-9 h-10 text-base"
        />
      </div>
      <button
        type="button"
        onClick={go}
        disabled={!name.trim()}
        className="inline-flex items-center gap-1.5 h-10 px-3 rounded-md text-sm font-medium bg-muted/60 hover:bg-muted text-foreground/80 transition-colors shrink-0 disabled:opacity-50 disabled:pointer-events-none"
      >
        <span className="hidden sm:inline">View</span>
        <ArrowRight className="size-4" />
      </button>
    </div>
  )
}
