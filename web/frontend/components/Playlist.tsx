import { useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import throttle from 'lodash/throttle'

type PlaylistItem = {
  id: string
  title: string
  length: string
}

type PlaylistProps = {
  onSubmit: (playlist: PlaylistItem[]) => void
}

export default function Playlist({ onSubmit }: PlaylistProps) {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([
    {
      id: '0',
      title: '本編',
      length: '02:30:00',
    },
  ])

  const totalInSeconds = playlist.reduce((total, item) => {
    const [minutes, seconds] = item.length.split(':').map(Number)
    return total + minutes * 60 + seconds
  }, 0)

  const totalHours = Math.floor(totalInSeconds / 3600) || 0
  const totalMinutes = Math.floor((totalInSeconds % 3600) / 60) || 0
  const totalSeconds = totalInSeconds % 60 || 0

  const totalTime = `${totalHours.toString().padStart(2, '0')}:${totalMinutes
    .toString()
    .padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`

  const handleAdd = () => {
    const newItem = { id: nanoid(), title: '', length: '' }
    setPlaylist([...playlist, newItem])
  }

  const handleDelete = (id: string) => {
    setPlaylist(playlist.filter((item) => item.id !== id))
  }

  const handleDrag = (
    e: React.DragEvent<HTMLDivElement>,
    oldIndex: number,
    newIndex: number
  ) => {
    e.preventDefault()
    const newPlaylist = [...playlist]
    const [removed] = newPlaylist.splice(oldIndex, 1)
    newPlaylist.splice(newIndex, 0, removed)
    setPlaylist(newPlaylist)
  }

  const handleSubmit = () => {
    onSubmit(playlist)
  }

  const [listRef] = useAutoAnimate({
    duration: 200,
  })

  const draggedIndexRef = useRef<number>(0)

  const throttledOnDragOver = throttle(
    (draggedIndex: number, overIndex: number) => {
      if (
        draggedIndex !== overIndex &&
        playlist[draggedIndex] !== playlist[overIndex] &&
        draggedIndexRef.current !== overIndex
      ) {
        const newPlaylist = [...playlist]
        const [draggedItem] = newPlaylist.splice(draggedIndex, 1)
        newPlaylist.splice(overIndex, 0, draggedItem)
        setPlaylist(newPlaylist)
        draggedIndexRef.current = overIndex
      }
    },
    500
  )

  return (
    <div>
      <div ref={listRef} className="flex flex-col gap-4 mb-4">
        {playlist.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center"
            onDrop={(e) => {
              const newIndex = parseInt(e.dataTransfer.getData('text/plain'))
              handleDrag(e, index, newIndex)
            }}
            // onDragOver={(e) => {
            //   e.preventDefault()
            //   const draggedIndex = parseInt(
            //     e.dataTransfer.getData('text/plain')
            //   )
            //   const overIndex = index
            //   throttledOnDragOver(draggedIndex, overIndex)
            // }}
          >
            <div className="flex-center gap-x-2">
              <input
                type="text"
                placeholder="タイトル"
                value={playlist[index]?.title}
                onChange={(e) =>
                  setPlaylist((cur) => {
                    const newPlaylist = [...cur]
                    newPlaylist[index].title = e.target.value
                    return newPlaylist
                  })
                }
                readOnly={playlist[index]?.id === '0'}
                className="p-2 border border-gray-400 rounded-md"
              />
              <input
                type="text"
                placeholder="hh:mm:ss"
                value={playlist[index]?.length}
                onChange={(e) =>
                  setPlaylist((cur) => {
                    const newPlaylist = [...cur]
                    newPlaylist[index].length = e.target.value
                    return newPlaylist
                  })
                }
                readOnly={playlist[index]?.id === '0'}
                className="p-2 border border-gray-400 rounded-md"
              />
              {playlist[index]?.id !== '0' && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white rounded-md leading-none w-8 h-8"
                >
                  X
                </button>
              )}
              <div
                className="flex-center text-white bg-gray-400 rounded-md leading-none font-bold text-xl w-8 h-8 cursor-grab"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData('text/plain', index.toString())
                }
              >
                ↕︎
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {totalTime && <p className="font-bold">Total: {totalTime}</p>}
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-10"
        >
          +
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded-md w-1/4"
        >
          Submit
        </button>
      </div>
    </div>
  )
}
