import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useMoviesStore } from '~/stores/index.'

export default function Shows() {
  const { handle } = useParams()

  const movies = useMoviesStore((s) => s.movies)

  const currentMovie = useMemo(() => {
    return movies.find((movie) => movie.handle === handle)
  }, [movies, handle])

  const ticketIds = useMemo(() => {
    return currentMovie?.products.nodes.flatMap((product) => product.id)
  }, [currentMovie])

  console.log(currentMovie)
  console.log(ticketIds)

  return (
    <div>
      <h1>{currentMovie?.title}</h1>
    </div>
  )
}
