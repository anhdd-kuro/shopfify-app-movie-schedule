import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Screen from '../components/Screen'
import { Movie, initialData } from './schedule.data'
import { Button, Modal, Tabs } from '@shopify/polaris'
import { toast } from 'react-toastify'

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

  const [openModal, setOpenModal] = useState(false)

  const [currentScreen, setCurrentScreen] = useState(1)

  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const [unavailableSeats, setUnavailableSeats] = useState<string[]>([])

  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTab(selectedTabIndex),
    []
  )

  useEffect(() => {
    const seats = document.querySelectorAll('#seatmap > g')

    seats.forEach((seat) => {
      const seatId = seat.getAttribute('id')

      seat.addEventListener('click', () => {
        if (!seatId) return
        setSelectedSeats((cur) => {
          if (!cur.includes(seatId)) return [...cur, seatId]
          return cur.filter((selectedSeat) => selectedSeat !== seatId)
        })
      })
    })
  }, [])

  console.log(unavailableSeats)

  useEffect(() => {
    const seats = document.querySelectorAll('#seatmap > g')

    seats.forEach((seat) => {
      const seatId = seat.getAttribute('id')

      if (selectedSeats.includes(seatId)) {
        seat.classList.add('selected')
      } else {
        seat.classList.remove('selected')
      }

      if (unavailableSeats.includes(seatId)) {
        seat.classList.add('unavailable')
      } else {
        seat.classList.remove('unavailable')
      }
    })
  }, [selectedSeats, unavailableSeats])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())
      const status = data['status']

      if (status === 'unavailable') {
        setUnavailableSeats((cur) =>
          Array.from(new Set([...cur, ...selectedSeats]))
        )
      }
      if (status === 'available') {
        setUnavailableSeats((cur) =>
          cur.filter((seat) => !selectedSeats.includes(seat))
        )
      }
      setOpenModal(false)
      toast.success('状態を更新しました')
    },
    [selectedSeats]
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
        {selectedSeats.length > 0 && (
          <div className="fixed bottom-4 right-4">
            <Button onClick={() => setOpenModal(true)}>一括編集</Button>
          </div>
        )}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="一括編集"
        >
          <Modal.Section>
            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="status">
                  状態:
                </label>
                <select
                  name="status"
                  id="status"
                  className="w-1/3 p-2 border border-gray-300 rounded-md"
                >
                  <option value="unavailable">販売不可</option>
                  <option value="available">販売可</option>
                </select>
              </div>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                確認
              </button>
            </form>
          </Modal.Section>
        </Modal>
      </div>
    </>
  )
}
