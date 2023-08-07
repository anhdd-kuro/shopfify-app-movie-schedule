import { create } from 'zustand'

export const useMoviesStore = create<{
  movies: Movie[]
  insertMovies: (movies: Movie[]) => void
}>((set) => ({
  movies: [],
  insertMovies: (movies: Movie[]) => set({ movies }),
}))
