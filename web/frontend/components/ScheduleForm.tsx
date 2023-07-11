import { toast } from 'react-toastify'
import { Movie } from '../pages/schedule.data'
import moment from 'moment-timezone'

type Screen = {
  id: number
  name: string
  schedule: Movie[]
}

export default function ScheduleForm({
  selectedMovie,
  movies,
  initialScreens,
  currentScreens,
  onSetCurrentScreens,
  onSetCurrentEvent,
}: {
  selectedMovie: Movie
  movies: Movie[]
  initialScreens: React.MutableRefObject<{ id: number; name: string }[]>
  currentScreens: Screen[]
  onSetCurrentScreens: (updatedScreens: Screen[]) => void
  onSetCurrentEvent: (updatedEvent: Movie) => void
}) {
  const handleScheduleFormSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    let updatedEvent: Movie = { ...selectedMovie }

    const updatedScreenSchedule = currentScreens.map((screen) => {
      if (screen.id === selectedMovie.resource.screenId) {
        const updatedSchedule = screen.schedule.map((movie) => {
          if (
            movie.resource.id === selectedMovie.resource.id &&
            movie.resource.screenId === selectedMovie.resource.screenId
          ) {
            const newStart = new Date(data['start-time'] as string)
            newStart.setUTCHours(newStart.getUTCHours())
            const newEnd = new Date(data['end-time'] as string)
            newEnd.setUTCHours(newEnd.getUTCHours())

            const movieId = +data['movieId']
            const movieById = movies.find((e) => e.resource.id === movieId)
            const screen = +data['screen']

            updatedEvent = {
              ...movie,
              title: movieById?.title || '未設定',
              resource: {
                ...movie.resource,
                screenId: screen,
              },
              start: newStart,
              end: newEnd,
            }

            return updatedEvent
          }
          return movie
        })
        return {
          ...screen,
          schedule: updatedSchedule,
        }
      }
      return screen
    })
    onSetCurrentEvent(updatedEvent)
    onSetCurrentScreens(updatedScreenSchedule)
  }

  console.log(selectedMovie.resource.id)

  return (
    <div>
      <form
        onSubmit={handleScheduleFormSubmit}
        className="flex flex-col gap-4 bg-gray-100 p-4 rounded-lg"
      >
        <div className="flex items-center gap-2">
          <label className="font-bold w-24" htmlFor="title">
            作品:
          </label>
          <select
            name="movieId"
            className="border border-gray-400 p-2 rounded-md w-1/3"
            defaultValue={selectedMovie.resource.id}
          >
            {selectedMovie.resource.id < 0 && (
              <option value={selectedMovie.resource.id} disabled>
                未設定
              </option>
            )}
            {movies.map((movie) => (
              <option key={movie.resource.id} value={movie.resource.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-bold w-24" htmlFor="screen">
            スクリーン:
          </label>
          <select
            name="screen"
            className="border border-gray-400 p-2 rounded-md w-1/3"
            defaultValue={selectedMovie.resource.screenId}
          >
            {initialScreens.current.map((screen) => (
              <option key={screen.id} value={screen.id}>
                {screen.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-bold w-24" htmlFor="start-time">
            上映開始:
          </label>
          <input
            type="datetime-local"
            id="start-time"
            name="start-time"
            defaultValue={moment(selectedMovie.start).format(
              'YYYY-MM-DDTHH:mm'
            )}
            className="border border-gray-400 p-2 rounded-md w-1/3"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-bold w-24" htmlFor="end-time">
            上映終了:
          </label>
          <input
            type="datetime-local"
            id="end-time"
            name="end-time"
            defaultValue={moment(selectedMovie.end).format('YYYY-MM-DDTHH:mm')}
            className="border border-gray-400 p-2 rounded-md w-1/3"
          />
        </div>
        <input
          type="submit"
          value="更新"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-1/3 cursor-pointer"
        />
      </form>
    </div>
  )
}
