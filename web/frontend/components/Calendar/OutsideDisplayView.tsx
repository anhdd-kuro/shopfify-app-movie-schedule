import moment from 'moment'
import { Movie } from '../../pages/schedule.data'
import React, { useMemo, useState } from 'react'
import { ViewStatic, ViewProps } from 'react-big-calendar'
import { colors } from '../../pages/schedule'
import { Checkbox } from '@shopify/polaris'

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
    <div className="w-full mx-auto mt-8 bg-white space-y-4">
      <div className="flex gap-4">
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
        <Checkbox
          label="ラベル表示"
          checked={isShowLabel}
          onChange={() => setIsShowLabel(!isShowLabel)}
        />
      </div>
      <dl className="flex flex-wrap">
        {/* Replace 4 with the desired number of columns */}
        {Object.entries(groupedEvents).map(([screenId, events], index) => (
          <div key={screenId} className="w-1/2 border">
            <dt
              className="flex-center border-b text-white"
              style={{
                backgroundColor: colors[index],
              }}
            >
              <h3 className="text-lg font-bold">Screen ID: {screenId}</h3>
            </dt>
            <dd>
              <ul className="divide-gray-300">
                {events.map((event) => (
                  <li
                    key={event.resource.id}
                    className="flex divide-x border-b border-gray-300"
                  >
                    <div className="flex-1 p-4 flex gap-2 items-center">
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
                    <div className="w-[100px] p-4 text-center">
                      <p>
                        <strong className="text-lg">
                          {moment(event.start).format('HH:mm')}
                        </strong>
                        <br />~ {moment(event.end).format('HH:mm')}
                      </p>
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
  return `${moment(date).locale('ja').format('MM月/DD日 (ddd)')}のスケジュール`
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
