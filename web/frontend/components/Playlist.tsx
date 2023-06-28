import { useCallback, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import { Draggable, Droppable } from './DragDrop'

export type PlaylistItem = {
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

  const playlistId = useMemo(
    () => playlist.flatMap((item) => item.id),
    [playlist]
  )

  const totalTime = useMemo(() => {
    const totalInSeconds = playlist.reduce((total, item) => {
      const [minutes, seconds] = item.length.split(':').map(Number)
      return total + minutes * 60 + seconds
    }, 0)

    const totalHours = Math.floor(totalInSeconds / 3600) || 0
    const totalMinutes = Math.floor((totalInSeconds % 3600) / 60) || 0
    const totalSeconds = totalInSeconds % 60 || 0

    return `${totalHours.toString().padStart(2, '0')}:${totalMinutes
      .toString()
      .padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`
  }, [playlist])

  const handleAdd = () => {
    const newItem = { id: nanoid(), title: '', length: '' }
    setPlaylist([...playlist, newItem])
  }

  const handleDelete = (id: string) => {
    setPlaylist(playlist.filter((item) => item.id !== id))
  }

  const handleSubmit = () => {
    onSubmit(playlist)
  }

  const handleDragHover = useCallback(
    (hoveringItemId: string, draggingItemId: string) => {
      if (hoveringItemId === draggingItemId) return
      const hoveringItemIndex = playlist.findIndex(
        (item) => item.id === hoveringItemId
      )
      const draggingItemIndex = playlist.findIndex(
        (item) => item.id === draggingItemId
      )

      if (hoveringItemIndex !== -1 && draggingItemIndex !== -1) {
        const newPlaylist = [...playlist]
        const [hoveringItem] = newPlaylist.splice(hoveringItemIndex, 1)
        newPlaylist.splice(draggingItemIndex, 0, hoveringItem)
        setPlaylist(newPlaylist)
      }
    },
    [playlist]
  )

  return (
    <div>
      <Droppable
        id="playlist"
        accept={playlistId}
        Wrapper={() => (
          <div className="flex flex-col gap-4 mb-4">
            {playlist.map((item, index) => (
              <div key={item.id} className="flex items-center">
                <div className="flex-center gap-x-2">
                  <Draggable
                    allAcceptTypes={playlistId}
                    onHover={(hoverItem) =>
                      handleDragHover(hoverItem.id, item.id)
                    }
                    item={{
                      id: item.id,
                      type: item.id,
                      dropItemId: 'playlist',
                    }}
                    Wrapper={() => (
                      <div className="flex-center text-white bg-gray-400 rounded-md leading-none font-bold text-xl w-8 h-8 cursor-grab">
                        ↕︎
                      </div>
                    )}
                  />
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
                </div>
              </div>
            ))}
          </div>
        )}
      />
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
