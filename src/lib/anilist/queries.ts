import { gql } from 'graphql-request'

export const VIEWER_QUERY = gql`
  query Viewer {
    Viewer {
      id
      name
      avatar {
        medium
      }
    }
  }
`

const BROWSE_MEDIA_FRAGMENT = `
  fragment BrowseMedia on Media {
    id
    type
    title { romaji english native userPreferred }
    coverImage { large extraLarge color }
    format
    episodes
    chapters
    season
    seasonYear
    startDate { year month day }
    averageScore
    mediaListEntry { id status }
  }
`

export const GENRE_COLLECTION_QUERY = gql`
  query GenreCollection {
    GenreCollection
  }
`

export const MEDIA_TAG_COLLECTION_QUERY = gql`
  query MediaTagCollection {
    MediaTagCollection {
      id
      name
      category
      description
      isAdult
    }
  }
`

export const BROWSE_FILTER_QUERY = gql`
  query BrowseFilter(
    $type: MediaType!,
    $page: Int!,
    $sort: [MediaSort],
    $search: String,
    $genre_in: [String],
    $tag_in: [String],
    $season: MediaSeason,
    $seasonYear: Int,
    $format: MediaFormat,
    $status: MediaStatus
  ) {
    Page(page: $page, perPage: 30) {
      pageInfo { currentPage hasNextPage total }
      media(
        type: $type,
        sort: $sort,
        search: $search,
        genre_in: $genre_in,
        tag_in: $tag_in,
        season: $season,
        seasonYear: $seasonYear,
        format: $format,
        status: $status,
        isAdult: false
      ) {
        ...BrowseMedia
      }
    }
  }
  ${BROWSE_MEDIA_FRAGMENT}
`

export const BROWSE_FILTER_COUNT_QUERY = gql`
  query BrowseFilterCount(
    $type: MediaType!,
    $sort: [MediaSort],
    $search: String,
    $genre_in: [String],
    $tag_in: [String],
    $season: MediaSeason,
    $seasonYear: Int,
    $format: MediaFormat,
    $status: MediaStatus
  ) {
    Page(perPage: 1) {
      pageInfo { total }
      media(
        type: $type,
        sort: $sort,
        search: $search,
        genre_in: $genre_in,
        tag_in: $tag_in,
        season: $season,
        seasonYear: $seasonYear,
        format: $format,
        status: $status,
        isAdult: false
      ) { id }
    }
  }
`

export const BROWSE_SECTION_QUERY = gql`
  query BrowseSectionData(
    $type: MediaType!,
    $page: Int!,
    $sort: [MediaSort],
    $season: MediaSeason,
    $seasonYear: Int,
    $status: MediaStatus
  ) {
    Page(page: $page, perPage: 30) {
      pageInfo { currentPage hasNextPage }
      media(type: $type, sort: $sort, season: $season, seasonYear: $seasonYear, status: $status) {
        ...BrowseMedia
      }
    }
  }
  ${BROWSE_MEDIA_FRAGMENT}
`

export const BROWSE_DATA_MANGA_QUERY = gql`
  query BrowseDataManga($type: MediaType!) {
    allTimePopular: Page(perPage: 10) {
      media(type: $type, sort: POPULARITY_DESC) {
        ...BrowseMedia
      }
    }
    top100: Page(perPage: 100) {
      media(type: $type, sort: SCORE_DESC) {
        ...BrowseMedia
      }
    }
  }
  ${BROWSE_MEDIA_FRAGMENT}
`

export const BROWSE_DATA_QUERY = gql`
  query BrowseData(
    $type: MediaType!,
    $season: MediaSeason!,
    $seasonYear: Int!,
    $nextSeason: MediaSeason!,
    $nextSeasonYear: Int!
  ) {
    popularThisSeason: Page(perPage: 10) {
      media(type: $type, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC) {
        ...BrowseMedia
      }
    }
    trending: Page(perPage: 10) {
      media(type: $type, sort: TRENDING_DESC) {
        ...BrowseMedia
      }
    }
    upcomingNextSeason: Page(perPage: 10) {
      media(type: $type, season: $nextSeason, seasonYear: $nextSeasonYear, sort: POPULARITY_DESC, status: NOT_YET_RELEASED) {
        ...BrowseMedia
      }
    }
    allTimePopular: Page(perPage: 10) {
      media(type: $type, sort: POPULARITY_DESC) {
        ...BrowseMedia
      }
    }
    top100: Page(perPage: 100) {
      media(type: $type, sort: SCORE_DESC) {
        ...BrowseMedia
      }
    }
  }
  ${BROWSE_MEDIA_FRAGMENT}
`

export const MEDIA_WITH_ENTRY_QUERY = gql`
  query MediaWithEntry($mediaId: Int!) {
    Media(id: $mediaId) {
      id
      type
      title { romaji english native userPreferred }
      coverImage { large extraLarge color }
      description(asHtml: false)
      episodes
      chapters
      volumes
      season
      seasonYear
      startDate { year month day }
      endDate { year month day }
      format
      status
      mediaListEntry {
        id
        mediaId
        status
        progress
        progressVolumes
        startedAt { year month day }
        completedAt { year month day }
        updatedAt
        createdAt
      }
    }
  }
`

export const MEDIA_SEARCH_QUERY = gql`
  query MediaSearch($search: String!, $type: MediaType!) {
    Page(perPage: 10) {
      media(search: $search, type: $type, sort: SEARCH_MATCH) {
        ...BrowseMedia
      }
    }
  }
  ${BROWSE_MEDIA_FRAGMENT}
`

export const MEDIA_LIST_COLLECTION_QUERY = gql`
  query MediaListCollection($userId: Int!, $type: MediaType!) {
    MediaListCollection(userId: $userId, type: $type) {
      lists {
        name
        status
        entries {
          id
          mediaId
          status
          progress
          progressVolumes
          startedAt {
            year
            month
            day
          }
          completedAt {
            year
            month
            day
          }
          updatedAt
          createdAt
          media {
            id
            type
            title {
              romaji
              english
              native
              userPreferred
            }
            coverImage {
              large
              extraLarge
              color
            }
            description(asHtml: false)
            episodes
            chapters
            volumes
            season
            seasonYear
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
            format
            status
          }
        }
      }
    }
  }
`
