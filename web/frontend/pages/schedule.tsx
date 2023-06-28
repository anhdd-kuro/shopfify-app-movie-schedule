import { Calendar, Event, momentLocalizer } from 'react-big-calendar'
import moment from 'moment-timezone'
import withDragAndDrop, {
  EventInteractionArgs,
} from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useCallback, useRef, useState } from 'react'
import clsx from 'clsx'
import { Modal, Tabs } from '@shopify/polaris'
import Screen from '../components/Screen'
import Playlist from '../components/Playlist'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { toast } from 'react-toastify'
import { Movie, initialData } from './schedule.data'

moment.tz.setDefault('Asia/Tokyo')

const DnDCalendar = withDragAndDrop(Calendar)

const localizer = momentLocalizer(moment)

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
