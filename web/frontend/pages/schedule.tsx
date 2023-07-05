import {
  Calendar,
  Event,
  Formats,
  SlotInfo,
  momentLocalizer,
} from 'react-big-calendar'
import 'moment/locale/ja'
import withDragAndDrop, {
  EventInteractionArgs,
} from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useCallback, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Modal, Tabs } from '@shopify/polaris'
import Screen from '../components/Screen'
import Playlist from '../components/Playlist'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { toast } from 'react-toastify'
import { Movie, initialData } from './schedule.data'
import Select from 'react-select'
import moment from 'moment-timezone'
import { customAlphabet } from 'nanoid'
import { ScheduleForm, TicketTypes } from '../components'

const localizer = momentLocalizer(moment)

const formats: Formats = {
  agendaDateFormat: 'M月D日',
  agendaHeaderFormat: ({ start, end }, culture, local) =>
    `${local.format(start, 'YYYY年M月D日', culture)} - ${local.format(
      end,
      'YYYY年M月D日',
      culture
    )}`,
  agendaTimeRangeFormat: ({ start, end }, culture, local) =>
    `${local.format(start, 'HH:mm', culture)} - ${local.format(
      end,
      'HH:mm',
      culture
    )}`,
  dateFormat: 'D',
  dayFormat: 'D(ddd)',
  monthHeaderFormat: 'YYYY年M月',
  dayHeaderFormat: 'M月D日(ddd)',
  dayRangeHeaderFormat: ({ start, end }, culture, local) =>
    `${local.format(start, 'M月D日', culture)} - ${local.format(
      end,
      'M月D日',
      culture
    )}`,
}

const DnDCalendar = withDragAndDrop(Calendar)

type Screen = {
  id: number
  name: string
  schedule: Movie[]
}

const colors = [
  '#FFC300',
  '#3D9970',
  '#FF5733',
  '#0074D9',
  '#900C3F',
  '#72c5e6',
  '#581845',
  '#C70039',
]

export default function MovieCalendar() {
  const calendarWrapper = useRef<HTMLDivElement>(null)
  const [tabContentWrapper] = useAutoAnimate()

  const initialScreens = useRef<Screen[]>([
    {
      id: -1,
      name: 'シネマ未設定',
      schedule: [],
    },
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
    handleSelectSlot,
    deleteSelectedEvent,
  } = useDndCalendarEvents(initialScreens.current)

  const screensOptions = useMemo(
    () =>
      initialScreens.current.map((screen) => ({
        label: screen.name,
        value: screen.id,
      })),
    [initialScreens]
  )

  const setColor = (screenId: number) => {
    if (screenId === 1) return colors[0]

    if (screenId === 2) return colors[1]

    if (screenId === 3) return colors[2]

    if (screenId === 4) return colors[3]

    if (screenId === 5) return colors[4]

    if (screenId === 6) return colors[5]

    return 'gray'
  }

  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
    []
  )

  return (
    <div className="h-full py-2">
      <div ref={calendarWrapper} className="space-y-6">
        <h3 className="text-center text-xl font-bold">上映カーレンダー</h3>
        <div className="sticky top-0 z-50 px-4">
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
            culture={moment.locale('ja')}
            localizer={localizer}
            formats={formats}
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
            doShowMoreDrillDown={true}
            onSelectSlot={handleSelectSlot}
            selectable
            popup
            step={15}
            timeslots={4}
            // components={components}
          />
        </div>
      </div>

      {selectedEvent && (
        <Modal
          open={!!selectedEvent}
          title={
            <div>
              <h2 className="flex items-center font-bold text-xl gap-2">
                {/* Status label */}
                <span
                  className={clsx(
                    'px-2 py-1 rounded text-xs font-bold text-white'
                  )}
                  style={{
                    backgroundColor: selectedEvent.resource.isActive
                      ? setColor(selectedEvent.resource.screenId)
                      : 'gray',
                  }}
                >
                  {selectedEvent.resource.isActive ? '公開中' : '非公開'}
                </span>
                {!selectedEvent.resource.isProduct && (
                  <span
                    className={clsx(
                      'px-2 py-1 rounded text-xs font-bold bg-gray-500 text-white'
                    )}
                  >
                    販売未設定
                  </span>
                )}
                <span>
                  {initialScreens.current.find(
                    (screen) => screen.id === selectedEvent.resource.screenId
                  )?.name || 'スクリーン未設定'}{' '}
                  - {selectedEvent.title || '作品未設定'}
                </span>
              </h2>
              <div className="flex items-center gap-4 mt-4">
                <button className="p-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">
                  商品として登録
                </button>
                {/* Delete button */}
                <button
                  className="p-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={deleteSelectedEvent}
                >
                  削除
                </button>
                {/* Cancel Button */}
                <button
                  className="p-10 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={() => {
                    setSelectedEvent(null)
                  }}
                >
                  販売キャンセル
                </button>
              </div>
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
                    <ScheduleForm
                      currentScreens={currentScreens}
                      movies={initialData}
                      initialScreens={initialScreens}
                      selectedMovie={selectedEvent}
                      onSetCurrentEvent={(newSelectedEvent) => {
                        setSelectedEvent(newSelectedEvent)
                        toast.success('Schedule updated successfully', {
                          toastId: 'ScheduleSubmitted',
                        })
                      }}
                      onSetCurrentScreens={(newCurrentScreens) => {
                        setCurrentScreens(newCurrentScreens)
                        toast.success('Schedule updated successfully', {
                          toastId: 'ScheduleSubmitted',
                        })
                      }}
                    />
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
                  {tabs[selectedTab].id === 'types' && <TicketTypes />}
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

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    const newShow = {
      title: '未設定',
      start: slotInfo.start,
      end: slotInfo.end,
      resource: {
        id: -customAlphabet('0123456789', 5)(),
        screenId: -1,
        isActive: false,
        isProduct: false,
      },
    }

    setCurrentScreens((cur) => {
      const updatedScreen = cur.map((screen) => {
        if (screen.id === -1) {
          return {
            ...screen,
            schedule: [...screen.schedule, newShow],
          }
        }
        return screen
      })
      return updatedScreen
    })

    setSelectedEvent(newShow)
  }, [])

  const deleteSelectedEvent = useCallback(() => {
    setCurrentScreens((cur) => {
      const updatedScreen = cur.map((screen) => {
        const updatedSchedule = screen.schedule.filter(
          (movie) => movie.resource.id !== selectedEvent.resource.id
        )
        return {
          ...screen,
          schedule: updatedSchedule,
        }
      })
      return updatedScreen
    })

    setSelectedEvent(null)

    toast.success('削除しました')
  }, [selectedEvent])

  return {
    handleEventDrop,
    handleEventClick,
    handleEventResize,
    allEventsInScreens,
    selectedEvent,
    setSelectedEvent,
    currentScreens,
    setCurrentScreens,
    handleSelectSlot,
    deleteSelectedEvent,
  }
}
