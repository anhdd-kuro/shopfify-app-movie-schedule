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
            <Screen id={currentScreen} />
          </div>
        </div>
      </div>
    </>
  )
}
