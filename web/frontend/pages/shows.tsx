import { Tabs, Text } from '@shopify/polaris'
import Screen from '../components/Screen'
import { useState, useCallback } from 'react'

export default function Shows() {
  const [selected, setSelected] = useState(0)

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    []
  )

  const tabs = [
    {
      id: 'all-customers-1',
      title: 'All customers',
      content: 'All',
      panelID: 'all-customers-content-1',
    },
    {
      id: 'seats',
      content: 'Seats',
      panelID: 'accepts-marketing-content-1',
    },
  ]

  return (
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
      {tabs[selected].id === 'seats' && (
        <>
          <Text as="h2">{tabs[selected].title}</Text>
          <Text as="p">{tabs[selected].content}</Text>
          <Screen />
        </>
      )}
    </Tabs>
  )
}
