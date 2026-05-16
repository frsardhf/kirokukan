import { useQuery } from '@tanstack/react-query'
import { anilistRequest } from '@/lib/anilist/client'
import { GENRE_COLLECTION_QUERY } from '@/lib/anilist/queries'

export function useGenreCollection() {
  return useQuery({
    queryKey: ['genre-collection'],
    staleTime: Infinity,
    queryFn: async () => {
      const data = await anilistRequest<{ GenreCollection: string[] }>(GENRE_COLLECTION_QUERY)
      return data.GenreCollection.filter((g) => g !== 'Hentai')
    },
  })
}
