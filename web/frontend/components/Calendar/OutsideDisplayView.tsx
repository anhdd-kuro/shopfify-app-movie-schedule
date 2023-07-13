import moment from 'moment'
import { Movie } from '../../pages/schedule.data'
import React, { useMemo, useState } from 'react'
import { ViewStatic, ViewProps } from 'react-big-calendar'
import { colors } from '../../pages/schedule'
import { Checkbox } from '@shopify/polaris'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import LateShowLabel from '../../components/LateShowLabel'

type GroupedEvents = {
  [screenId: string]: Movie[]
}

const CustomDay: React.FC<ViewProps<Movie>> & ViewStatic = ({
  date,
  events,
  ...props
}: ViewProps<Movie>) => {
  const [isActiveChecked, setIsActiveChecked] = useState(true)
  const [isProductChecked, setIsProductChecked] = useState(true)
  const [isShowLabel, setIsShowLabel] = useState(true)
  const [isShowLens, setIsShowLens] = useState(true)

  const [scheduleWrapperRef] = useAutoAnimate({})

  const groupedEvents = useMemo(() => {
    const _groupedEvents: GroupedEvents = {}

    const filteredEvents = events
      .filter((event) => {
        const eventDate = moment(event.start).format('YYYY-MM-DD')
        const desiredDate = moment(date).format('YYYY-MM-DD')
        return (
          eventDate === desiredDate &&
          (!isActiveChecked || event.resource.isActive) &&
          (!isProductChecked || event.resource.isProduct)
        )
      })
      .sort((a, b) => {
        if (a.start < b.start) {
          return -1
        }
        if (a.start > b.start) {
          return 1
        }
        return 0
      })

    filteredEvents.forEach((event) => {
      const { screenId } = event.resource
      if (_groupedEvents[screenId]) {
        _groupedEvents[screenId].push(event)
      } else {
        _groupedEvents[screenId] = [event]
      }
    })
    return _groupedEvents
  }, [date, events, isActiveChecked, isProductChecked])

  return (
    <div className="w-full mx-auto mt-6 bg-white space-y-4">
      <div className="flex gap-8 items-center">
        <div className="flex gap-4 items-center">
          <p className="font-bold">絞り込み: </p>
          <Checkbox
            label="販売中"
            checked={isActiveChecked}
            onChange={() => setIsActiveChecked(!isActiveChecked)}
          />
          <Checkbox
            label="販売可能"
            checked={isProductChecked}
            onChange={() => setIsProductChecked(!isProductChecked)}
          />
        </div>
        <hr className="block w-[1px] h-4 border-l border-gray-500" />
        <div className="flex gap-4 items-center">
          <p className="font-bold">表示: </p>
          <Checkbox
            label="ラベル表示"
            checked={isShowLabel}
            onChange={() => setIsShowLabel(!isShowLabel)}
          />
          <Checkbox
            label="レンズ表示"
            checked={isShowLens}
            onChange={() => setIsShowLens(!isShowLens)}
          />
        </div>
      </div>
      <dl ref={scheduleWrapperRef} id="day-schedule" className="flex flex-wrap">
        {/* Replace 4 with the desired number of columns */}
        {Object.entries(groupedEvents).map(([screenId, events], index) => (
          <div key={screenId} className="w-1/2 ">
            <dt
              className="flex-center border-b text-white"
              style={{
                backgroundColor: colors[index],
              }}
            >
              <h3 className="text-lg font-bold">シネマ {screenId}</h3>
            </dt>
            <dd>
              <ul className="divide-gray-300">
                {events.map((event) => (
                  <li
                    key={event.resource.id}
                    className="flex divide-x border-b border-l border-r border-gray-300"
                  >
                    <div className="flex flex-col justify-end flex-1 divide-y divide-gray-100">
                      <div className="flex gap-2 items-center p-4">
                        <h4>{event.title}</h4> {/* Status label */}
                        {isShowLabel && (
                          <>
                            <span
                              className="px-2 py-1 rounded text-xs font-bold text-white"
                              style={{
                                backgroundColor: event.resource.isActive
                                  ? colors[index]
                                  : 'gray',
                              }}
                            >
                              {event.resource.isActive ? '販売中' : '非公開'}
                            </span>
                            {!event.resource.isProduct && (
                              <span className="px-2 py-1 rounded text-xs font-bold bg-gray-500 text-white">
                                販売未設定
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex px-4 divide-x">
                        {/* Total length in minutes */}
                        {isShowLens && (
                          <p className="text-center flex-1 py-2 font-bold">
                            {event.resource.lens}
                          </p>
                        )}
                        <p className="mr-0 ml-auto py-2 pl-4 font-bold">
                          {Math.floor(
                            (event.end.getTime() - event.start.getTime()) /
                              1000 /
                              60
                          )}
                          分
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center flex-col w-[100px]text-center divide-y">
                      <p className="flex-center px-4 py-2 flex-1">
                        <span>
                          <strong className="text-lg">
                            {moment(event.start).format('HH:mm')}
                          </strong>
                          <br />~ {moment(event.end).format('HH:mm')}
                        </span>
                      </p>
                      {event.end.getHours() >= 20 && (
                        <div className="w-full">
                          <LateShowLabel rounded={false} />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

CustomDay.title = (date: Date) => {
  return `${moment(date).locale('ja').format('MM月/DD日 (ddd)')} スケジュール`
}

CustomDay.navigate = (date: Date, action: 'PREV' | 'NEXT' | 'DATE') => {
  switch (action) {
    case 'PREV':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
    case 'NEXT':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    case 'DATE':
      return date
    default:
      return date
  }
}

export default CustomDay
