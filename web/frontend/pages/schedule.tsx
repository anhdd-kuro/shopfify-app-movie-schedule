import { Calendar, Event, momentLocalizer } from 'react-big-calendar'
import moment from 'moment-timezone'
import withDragAndDrop, {
  EventInteractionArgs,
} from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useCallback, useRef, useState } from 'react'
import clsx from 'clsx'
import { Modal, Tabs, Text } from '@shopify/polaris'
import Screen from '../components/Screen'
import Playlist from '../components/Playlist'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { toast } from 'react-toastify'

moment.tz.setDefault('Asia/Tokyo')

const DnDCalendar = withDragAndDrop(Calendar)

const localizer = momentLocalizer(moment)

type Movie = Event & {
  id: number
}

type Screen = {
  id: number
  name: string
  schedule: Movie[]
}

export default function MovieCalendar() {
  const calendarWrapper = useRef<HTMLDivElement>(null)
  const [tabContentWrapper] = useAutoAnimate()

  const [screens, setScreens] = useState<Screen[]>([
    {
      id: 1,
      name: 'Screen 1',
      schedule: initialData,
    },
    {
      id: 2,
      name: 'Screen 2',
      schedule: [],
    },
  ])

  const [currentScreen, setCurrentScreen] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState<Movie>(null)

  const [selected, setSelected] = useState(0)

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    []
  )

  const handleEventDrop =
    (screenId: number) =>
    ({ event, start, end }: EventInteractionArgs<Movie>) => {
      const updatedScreenSchedule = screens.map((screen) => {
        if (screen.id === screenId) {
          const updatedSchedule = screen.schedule.map((movie) => {
            if (movie.title === event.title) {
              return {
                ...movie,
                start: new Date(start),
                end: new Date(end),
              }
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
      setScreens(updatedScreenSchedule)
    }

  const handleEventClick = useCallback((calEvent: Event & Movie) => {
    setSelectedEvent({
      ...calEvent,
    })
  }, [])

  const handleEventResize =
    (screenId: number) =>
    ({ event, start, end }: EventInteractionArgs<Movie>) => {
      const updatedScreenSchedule = screens.map((screen) => {
        if (screen.id === screenId) {
          const updatedSchedule = screen.schedule.map((movie) => {
            if (movie.title === event.title) {
              return {
                ...movie,
                start: new Date(start),
                end: new Date(end),
              }
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
      setScreens(updatedScreenSchedule)
    }

  const handleScheduleFormSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const updatedScreenSchedule = screens.map((screen) => {
      if (screen.id === currentScreen) {
        const updatedSchedule = screen.schedule.map((movie) => {
          if (movie.title === selectedEvent.title) {
            const newStart = new Date(data['start-time'] as string)
            newStart.setUTCHours(newStart.getUTCHours() + 9)
            const newEnd = new Date(data['end-time'] as string)
            newEnd.setUTCHours(newEnd.getUTCHours() + 9)

            return {
              ...movie,
              start: newStart,
              end: newEnd,
            }
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
    toast.success('Schedule updated successfully')
    console.log(updatedScreenSchedule)
    setScreens(updatedScreenSchedule)
  }

  console.log('updated', screens)

  return (
    <div className="flex h-full">
      <div className="w-[10%] bg-gray-200 p-4 min-w-[120px]">
        {/* Apply padding using Tailwind CSS classes */}
        <h3 className="mb-4 text-xl font-bold">Screens</h3>
        <ul className="list-none p-0">
          {screens.map((screen) => (
            <li
              key={screen.id}
              className={clsx(
                'mb-2 cursor-pointer',
                currentScreen === screen.id && 'font-bold text-green-700'
              )}
              onClick={() => setCurrentScreen(screen.id)}
            >
              {screen.name}
            </li>
          ))}
        </ul>
      </div>
      <div ref={calendarWrapper} className="flex-1">
        <div className="h-screen min-h-[600px] p-4 overflow-auto">
          <h3 className="text-xl font-bold mb-4">
            {screens[currentScreen - 1].name}
          </h3>
          <DnDCalendar
            localizer={localizer}
            events={screens[currentScreen - 1].schedule}
            draggableAccessor={() => true}
            onEventDrop={handleEventDrop(screens[currentScreen - 1].id)}
            eventPropGetter={() => ({
              style: {
                cursor: 'grab',
              },
            })}
            onSelectEvent={handleEventClick}
            onEventResize={handleEventResize(screens[currentScreen - 1].id)}
          />
        </div>

        {selectedEvent && (
          <Modal
            open={!!selectedEvent}
            title={selectedEvent.title}
            onClose={() => {
              setSelectedEvent(null)
            }}
            large
          >
            <Modal.Section>
              <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                <div ref={tabContentWrapper} className="p-4 h-[80vh]">
                  {tabs[selected].id === 'seats' && (
                    <>
                      <Screen />
                    </>
                  )}
                  {tabs[selected].id === 'schedule' && (
                    <div>
                      <form
                        onSubmit={handleScheduleFormSubmit}
                        className="flex flex-col gap-4 bg-gray-100 p-4 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <label
                            className="font-bold w-24"
                            htmlFor="start-time"
                          >
                            Start Time:
                          </label>
                          <input
                            type="datetime-local"
                            id="start-time"
                            name="start-time"
                            defaultValue={selectedEvent.start
                              .toISOString()
                              .slice(0, 16)}
                            className="border border-gray-400 p-2 rounded-md w-1/3"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="font-bold w-24" htmlFor="end-time">
                            End Time:
                          </label>
                          <input
                            type="datetime-local"
                            id="end-time"
                            name="end-time"
                            defaultValue={selectedEvent.end
                              .toISOString()
                              .slice(0, 16)}
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
                  )}
                  {tabs[selected].id === 'playlist' && (
                    <div>
                      <Playlist
                        onSubmit={(list) => {
                          console.log(list)
                        }}
                      />
                    </div>
                  )}
                </div>
              </Tabs>
            </Modal.Section>
          </Modal>
        )}
      </div>
    </div>
  )
}

function makeDateTime(
  timeFrame: 'past' | 'future' | 'today',
  options: {
    amount?: number
    unit?: moment.unitOfTime.DurationConstructor
    hour?: number
    minute?: number
  }
): Date {
  const now = moment()

  if (timeFrame === 'past') {
    return now
      .subtract(options.amount, options.unit)
      .hour(options.hour)
      .minute(options.minute)
      .toDate()
  }

  if (timeFrame === 'future') {
    return now
      .add(options.amount, options.unit)
      .hour(options.hour)
      .minute(options.minute)
      .toDate()
  }

  return now.hour(options.hour).minute(options.minute).toDate()
}

const initialData: Movie[] = [
  {
    id: 1,
    title: 'The Shawshank Redemption',
    start: makeDateTime('past', {
      amount: 2,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 2, unit: 'days', hour: 12, minute: 0 }),
  },
  {
    id: 2,
    title: 'The Godfather',
    start: makeDateTime('past', {
      amount: 1,
      unit: 'days',
      hour: 14,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 1, unit: 'days', hour: 16, minute: 0 }),
  },
  {
    id: 3,
    title: 'The Dark Knight',
    start: makeDateTime('today', { hour: 18, minute: 0 }),
    end: makeDateTime('today', { hour: 20, minute: 0 }),
  },
  {
    id: 4,
    title: '12 Angry Men',
    start: makeDateTime('past', {
      amount: 4,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 4, unit: 'days', hour: 12, minute: 0 }),
  },
  {
    id: 5,
    title: "Schindler's List",
    start: makeDateTime('past', {
      amount: 5,
      unit: 'days',
      hour: 14,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 5, unit: 'days', hour: 16, minute: 0 }),
  },
  {
    id: 6,
    title: 'The Lord of the Rings: The Return of the King',
    start: makeDateTime('past', {
      amount: 6,
      unit: 'days',
      hour: 18,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 6, unit: 'days', hour: 20, minute: 0 }),
  },
  {
    id: 7,
    title: 'Pulp Fiction',
    start: makeDateTime('past', {
      amount: 7,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 7, unit: 'days', hour: 12, minute: 0 }),
  },
  {
    id: 8,
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    start: makeDateTime('past', {
      amount: 8,
      unit: 'days',
      hour: 14,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 8, unit: 'days', hour: 16, minute: 0 }),
  },
  {
    id: 9,
    title: 'Forrest Gump',
    start: makeDateTime('past', {
      amount: 9,
      unit: 'days',
      hour: 18,
      minute: 0,
    }),
    end: makeDateTime('past', { amount: 9, unit: 'days', hour: 20, minute: 0 }),
  },
  {
    id: 10,
    title: 'Inception',
    start: makeDateTime('past', {
      amount: 10,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('past', {
      amount: 10,
      unit: 'days',
      hour: 12,
      minute: 0,
    }),
  },
  {
    id: 11,
    title: 'Future Event',
    start: makeDateTime('future', {
      amount: 1,
      unit: 'days',
      hour: 10,
      minute: 0,
    }),
    end: makeDateTime('future', {
      amount: 1,
      unit: 'days',
      hour: 12,
      minute: 0,
    }),
  },
  {
    id: 12,
    title: 'Another Future Event',
    start: makeDateTime('future', {
      amount: 2,
      unit: 'days',
      hour: 14,
      minute: 0,
    }),
    end: makeDateTime('future', {
      amount: 2,
      unit: 'days',
      hour: 16,
      minute: 0,
    }),
  },
]

const tabs = [
  {
    id: 'schedule',
    content: 'Schedule',
    panelID: 'schedule',
  },
  {
    id: 'playlist',
    content: 'Playlist',
    panelID: 'Playlist',
  },
  {
    id: 'seats',
    content: 'Seats',
    panelID: 'Seats',
  },
]
