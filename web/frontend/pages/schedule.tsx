import { Calendar, Event, momentLocalizer } from 'react-big-calendar'
import moment from 'moment-timezone'
import withDragAndDrop, {
  EventInteractionArgs,
} from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useCallback, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Checkbox, Modal, Tabs } from '@shopify/polaris'
import Screen from '../components/Screen'
import Playlist from '../components/Playlist'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { toast } from 'react-toastify'
import { Movie, initialData } from './schedule.data'
import Select from 'react-select'

moment.tz.setDefault('Asia/Tokyo')

const DnDCalendar = withDragAndDrop(Calendar)

const localizer = momentLocalizer(moment)

type Screen = {
  id: number
  name: string
  schedule: Movie[]
}

const colors = [
  '#FFC300',
  '#3D9970',
  '#FF5733',
  '#72c5e6',
  '#900C3F',
  '#581845',
  '#0074D9',
  '#C70039',
]

export default function MovieCalendar() {
  const calendarWrapper = useRef<HTMLDivElement>(null)
  const [tabContentWrapper] = useAutoAnimate()

  const initialScreens = useRef<Screen[]>([
    {
      id: 1,
      name: 'シネマ 1',
      schedule: initialData
        .slice(0, 3)
        .map((e) => ({ ...e, resource: { ...e.resource, screenId: 1 } })),
    },
    {
      id: 2,
      name: 'シネマ 2',
      schedule: initialData.slice(4, 7).map((e) => ({
        ...e,
        resource: { ...e.resource, screenId: 2 },
      })),
    },
    {
      id: 3,
      name: 'シネマ 3',
      schedule: initialData.slice(7, 9).map((e) => ({
        ...e,
        resource: { ...e.resource, screenId: 3 },
      })),
    },
    {
      id: 4,
      name: 'シネマ 4',
      schedule: initialData.slice(4, 9).map((e) => ({
        ...e,
        resource: { ...e.resource, screenId: 4 },
      })),
    },
  ])

  const {
    currentScreens,
    setCurrentScreens,
    selectedEvent,
    allEventsInScreens,
    handleEventClick,
    handleEventDrop,
    handleEventResize,
    setSelectedEvent,
  } = useDndCalendarEvents(initialScreens.current)

  const screensOptions = useMemo(
    () =>
      initialScreens.current.map((screen) => ({
        label: screen.name,
        value: screen.id,
      })),
    [initialScreens]
  )

  const setColor = (screenId: number) =>
    screenId === 1
      ? colors[0]
      : screenId === 2
      ? colors[1]
      : screenId === 3
      ? colors[2]
      : colors[3]

  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
    []
  )

  const handleScheduleFormSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const updatedScreenSchedule = currentScreens.map((screen) => {
      if (screen.id === selectedEvent.resource.screenId) {
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
    setCurrentScreens(updatedScreenSchedule)
  }

  return (
    <div className="h-full py-2">
      <div ref={calendarWrapper} className="space-y-6">
        <h3 className="text-center text-xl font-bold">上映カーレンダー</h3>
        <div className="sticky top-0 z-50">
          <Select
            closeMenuOnSelect={false}
            components={{}}
            styles={{
              multiValueLabel: (base, { data }) => ({
                ...base,
                backgroundColor: setColor(data.value),
                color: '#fff',
                fontWeight: 'bold',
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }),
              multiValueRemove: (base, { data }) => ({
                ...base,
                backgroundColor: setColor(data.value),
                color: '#fff',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                // borderLeft: '1px solid #fff',
                ':hover': {
                  opacity: 0.8,
                },
              }),
            }}
            isMulti
            defaultValue={screensOptions}
            options={screensOptions}
            onChange={(selectedScreens) => {
              const selectedScreenIds = selectedScreens.map(
                (screen) => screen.value
              )
              const selectedScreensData = initialScreens.current.filter(
                (screen) => selectedScreenIds.includes(screen.id)
              )
              setCurrentScreens(selectedScreensData)
            }}
          />
        </div>
        <div className="h-screen min-h-[600px] p-4 overflow-auto">
          <DnDCalendar
            localizer={localizer}
            events={allEventsInScreens}
            draggableAccessor={() => true}
            onEventDrop={handleEventDrop}
            eventPropGetter={(event: Movie, start, end, isSelected) => {
              return {
                className: clsx('cursor-grab'),
                style: {
                  boxSizing: 'border-box',
                  backgroundColor: !event.resource.isProduct
                    ? 'lightgray'
                    : event.resource.isActive
                    ? setColor(event.resource.screenId)
                    : '#fff',
                  color: !event.resource.isProduct
                    ? '#000'
                    : !event.resource.isActive &&
                      setColor(event.resource.screenId),
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: !event.resource.isProduct
                    ? setColor(event.resource.screenId)
                    : setColor(event.resource.screenId),
                },
              }
            }}
            onSelectEvent={handleEventClick}
            onEventResize={handleEventResize}
            // components={components}
          />
        </div>
      </div>

      {selectedEvent && (
        <Modal
          open={!!selectedEvent}
          title={
            <div className="flex items-center gap-4">
              {
                initialScreens.current.find(
                  (screen) => screen.id === selectedEvent.resource.screenId
                )?.name
              }{' '}
              - {selectedEvent.title}
              <button className="p-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">
                商品として登録
              </button>
            </div>
          }
          onClose={() => {
            setSelectedEvent(null)
          }}
          large
        >
          <Modal.Section>
            <div className="flex flex-col justify-between h-[66vh]">
              <Tabs
                tabs={tabs}
                selected={selectedTab}
                onSelect={handleTabChange}
              >
                <div ref={tabContentWrapper} className="p-4 h-[80%]">
                  {tabs[selectedTab].id === 'seats' && (
                    <>
                      <Screen />
                    </>
                  )}
                  {tabs[selectedTab].id === 'schedule' && (
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
                  {tabs[selectedTab].id === 'playlist' && (
                    <div>
                      <Playlist
                        onSubmit={(list) => {
                          console.log(list)
                        }}
                      />
                    </div>
                  )}
                  {tabs[selectedTab].id === 'types' && (
                    <div>
                      <h3 className="font-bold">販売可能なチケット種別</h3>
                      <div className="flex gap-8 mt-4">
                        <Checkbox label="一般" checked />
                        <Checkbox label="小学生" checked />
                        <Checkbox label="学生" checked />
                        <Checkbox label="シニア" checked />
                      </div>
                    </div>
                  )}
                </div>
              </Tabs>
            </div>
          </Modal.Section>
        </Modal>
      )}
    </div>
  )
}

const tabs = [
  {
    id: 'schedule',
    content: 'スケジュール',
    panelID: 'schedule',
  },
  {
    id: 'playlist',
    content: 'プレイリスト',
    panelID: 'Playlist',
  },
  {
    id: 'seats',
    content: '座席表',
    panelID: 'Seats',
  },
  {
    id: 'types',
    content: 'チケット種別',
    panelID: 'Types',
  },
]

const useDndCalendarEvents = (initialScreens: Screen[]) => {
  const [currentScreens, setCurrentScreens] = useState(initialScreens)

  const allEventsInScreens = useMemo(
    () =>
      currentScreens.reduce((acc, screen) => {
        return [...acc, ...screen.schedule]
      }, []),
    [currentScreens]
  )
  const [selectedEvent, setSelectedEvent] = useState<Movie>(null)

  const handleEventDrop = ({
    event,
    start,
    end,
  }: EventInteractionArgs<Movie>) => {
    const updatedScreenSchedule = currentScreens.map((screen) => {
      const updatedSchedule = screen.schedule.map((movie) => {
        if (
          movie.resource.id === event.resource.id &&
          movie.resource.screenId === event.resource.screenId
        ) {
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
    })
    setCurrentScreens(updatedScreenSchedule)
  }

  const handleEventClick = useCallback((calEvent: Event & Movie) => {
    setSelectedEvent({
      ...calEvent,
    })
  }, [])

  const handleEventResize = useCallback(
    ({ event, start, end }: EventInteractionArgs<Movie>) => {
      setCurrentScreens((cur) =>
        cur.map((screen) => {
          const updatedSchedule = screen.schedule.map((movie) => {
            if (
              movie.resource.id === event.resource.id &&
              movie.resource.screenId === event.resource.screenId
            ) {
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
        })
      )
    },
    []
  )

  return {
    handleEventDrop,
    handleEventClick,
    handleEventResize,
    allEventsInScreens,
    selectedEvent,
    setSelectedEvent,
    currentScreens,
    setCurrentScreens,
  }
}
