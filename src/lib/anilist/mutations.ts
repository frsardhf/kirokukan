import { gql } from 'graphql-request'

export const SAVE_MEDIA_LIST_ENTRY_MUTATION = gql`
  mutation SaveMediaListEntry(
    $id: Int
    $mediaId: Int
    $status: MediaListStatus
    $progress: Int
    $progressVolumes: Int
    $startedAt: FuzzyDateInput
    $completedAt: FuzzyDateInput
  ) {
    SaveMediaListEntry(
      id: $id
      mediaId: $mediaId
      status: $status
      progress: $progress
      progressVolumes: $progressVolumes
      startedAt: $startedAt
      completedAt: $completedAt
    ) {
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
    }
  }
`

export const DELETE_MEDIA_LIST_ENTRY_MUTATION = gql`
  mutation DeleteMediaListEntry($id: Int!) {
    DeleteMediaListEntry(id: $id) {
      deleted
    }
  }
`
