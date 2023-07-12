import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Screen from '../components/Screen'
import { Movie, initialData } from './schedule.data'
import { Tabs } from '@shopify/polaris'

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

  const tabs = useMemo(
    () =>
      screens.map((s) => ({
        id: s.id + '',
        content: s.name,
        panelID: s.name,
      })),
    [screens]
  )

  const [currentScreen, setCurrentScreen] = useState(1)

  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
    []
  )

  return (
    <>
      <div className="min-h-screen">
        <Tabs
          tabs={tabs}
          selected={selectedTab}
          onSelect={(index) => {
            handleTabChange(index)
            setCurrentScreen(screens[index].id)
          }}
        >
          <div className="w-3/4 m-auto">
            <Screen id={currentScreen} />
          </div>
        </Tabs>
      </div>
    </>
  )
}
