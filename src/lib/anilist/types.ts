export type MediaListStatus =
  | 'CURRENT'
  | 'PLANNING'
  | 'COMPLETED'
  | 'DROPPED'
  | 'PAUSED'
  | 'REPEATING'

export type MediaType = 'ANIME' | 'MANGA'

export type MediaSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'

export type MediaStatus =
  | 'FINISHED'
  | 'RELEASING'
  | 'NOT_YET_RELEASED'
  | 'CANCELLED'
  | 'HIATUS'

export type MediaFormat =
  | 'TV'
  | 'TV_SHORT'
  | 'MOVIE'
  | 'SPECIAL'
  | 'OVA'
  | 'ONA'
  | 'MUSIC'

export interface FuzzyDate {
  year: number | null
  month: number | null
  day: number | null
}

export interface MediaTitle {
  romaji: string | null
  english: string | null
  native: string | null
  userPreferred: string
}

export interface MediaCoverImage {
  large: string | null
  extraLarge: string | null
  color: string | null
}

export interface Media {
  id: number
  type: MediaType
  title: MediaTitle
  coverImage: MediaCoverImage
  description: string | null
  episodes: number | null
  chapters: number | null
  volumes: number | null
  season: MediaSeason | null
  seasonYear: number | null
  startDate: FuzzyDate
  endDate: FuzzyDate
  format: MediaFormat | null
  status: MediaStatus | null
}

export interface MediaListEntry {
  id: number
  mediaId: number
  status: MediaListStatus
  progress: number
  progressVolumes: number
  startedAt: FuzzyDate
  completedAt: FuzzyDate
  updatedAt: number
  createdAt: number
  media: Media
}

export interface MediaListGroup {
  name: string
  status: MediaListStatus | null
  entries: MediaListEntry[]
}

export interface MediaListCollection {
  lists: MediaListGroup[]
}

export interface Viewer {
  id: number
  name: string
  avatar: { medium: string | null } | null
}

export type MediaSort =
  | 'POPULARITY_DESC'
  | 'TRENDING_DESC'
  | 'SCORE_DESC'
  | 'UPDATED_AT_DESC'
  | 'START_DATE_DESC'
  | 'FAVOURITES_DESC'
  | 'SEARCH_MATCH'

export interface MediaTag {
  id: number
  name: string
  category: string | null
  description: string | null
  isAdult: boolean
}

export interface BrowseMedia {
  id: number
  type: MediaType
  title: MediaTitle
  coverImage: MediaCoverImage
  format: MediaFormat | null
  episodes: number | null
  chapters: number | null
  season: MediaSeason | null
  seasonYear: number | null
  startDate: FuzzyDate
  averageScore: number | null
  mediaListEntry: { id: number; status: MediaListStatus } | null
}
