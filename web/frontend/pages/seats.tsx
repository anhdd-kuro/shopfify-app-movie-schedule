import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState } from 'react'
import clsx from 'clsx'
import Screen from '../components/Screen'
import { Movie, initialData } from './schedule.data'

type Screen = {
  id: number
  name: string
  schedule: Movie[]
}

export default function Seats() {
  const [screens, setScreens] = useState<Screen[]>([
    {
      id: 1,
      name: 'シネマ 1',
      schedule: initialData,
    },
    {
      id: 2,
      name: 'シネマ 2',
      schedule: [],
    },
  ])

  const [currentScreen, setCurrentScreen] = useState(1)

  return (
    <>
      <div className="flex min-h-screen">
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
        <div className="flex-1">
          <div className="w-3/4 m-auto">
            {currentScreen === 1 && <Screen />}
            {currentScreen === 2 && <Screen />}
          </div>
        </div>
      </div>
      {/* {selectedEvent && (
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
                        <label className="font-bold w-24" htmlFor="start-time">
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
      )} */}
    </>
  )
}
