import { toast } from 'react-toastify'
import { useMetaobjectQuery } from '../../hooks'
import { Link } from 'react-router-dom'
import { useMoviesStore } from '~/stores/index.'
import { useEffect } from 'react'
// import { SmartCollection } from '@shopify/shopify-api/rest/admin/2023-04/smart_collection'

export default function Shows() {
  const { parsedData: movies, isLoading } = useMetaobjectQuery<Movie>({
    url: '/api/movies',
    reactQueryOptions: {
      onSuccess: () => {
        toast.success('Movies fetched successfully')
      },
    },
    referenceKeys: ['thumbnail'],
    listReferencesKeys: ['products', 'genre'],
  })

  const insertMoviesToStore = useMoviesStore((s) => s.insertMovies)

  useEffect(() => {
    if (movies) {
      insertMoviesToStore(movies)
    }
  }, [movies])

  return (
    <>
      {isLoading && <p>Loading...</p>}
      <div className="flex flex-wrap gap-4">
        {movies?.map((movie) => (
          <div key={movie.handle} className="w-1/4 relative hover:opacity-80">
            <Link
              to={`/shows/${movie.handle}`}
              className="absolute w-full h-full top-0 left-0"
            />
            <div className="bg-white rounded-lg shadow-lg">
              <img
                className="w-full h-48 object-cover object-center"
                // @ts-ignore-next-line
                src={movie.thumbnail?.image.url || ''}
                alt={movie.thumbnail?.image.altText || movie.title}
              />
              <div className="p-4">
                <h2 className="text-gray-900 font-bold text-2xl mb-2">
                  {movie.title}
                </h2>
                {/* <div dangerouslySetInnerHTML={{ __html: movie.description }} /> */}
                <ul>
                  {/* {useMetafieldsQuery(collection.id).map((metafield) => (
                    <li key={metafield.id}>
                      <p className="text-gray-700">
                        {metafield.key}: {metafield.value}
                      </p>
                    </li>
                  ))} */}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
