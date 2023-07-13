import { useCallback, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import { Draggable, Droppable } from './DragDrop'
import Select from 'react-select'

export type PlaylistItem = {
  id: string
  title: string
  length: number
}

const playlistData: PlaylistItem[] = [
  { id: '1', title: '君の名は（予告編）', length: 23 },
  { id: '2', title: '天気の子（予告編）', length: 27 },
  { id: '3', title: '千と千尋の神隠し（予告編）', length: 19 },
  { id: '4', title: 'となりのトトロ（予告編）', length: 28 },
  { id: '5', title: 'ハウルの動く城（予告編）', length: 21 },
  { id: '6', title: '風立ちぬ（予告編）', length: 22 },
  { id: '7', title: 'おおかみこどもの雨と雪（予告編）', length: 25 },
  { id: '8', title: '秒速5センチメートル（予告編）', length: 16 },
  { id: '9', title: '聲の形（予告編）', length: 30 },
  {
    id: '10',
    title: 'あの日見た花の名前を僕達はまだ知らない。（予告編）',
    length: 12,
  },
  { id: '11', title: '盗撮映像', length: 13 },
]

const playListOptions = playlistData.map((item) => ({
  label: item.title,
  value: item.id,
}))

type PlaylistProps = {
  onSubmit: (playlist: PlaylistItem[]) => void
}

export default function Playlist({ onSubmit }: PlaylistProps) {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([
    {
      id: '0',
      title: '本編',
      length: 9000,
    },
  ])

  const playlistId = useMemo(
    () => playlist.flatMap((item) => item.id),
    [playlist]
  )

  const totalTimeInSeconds = useMemo(() => {
    return playlist.reduce((acc, cur) => {
      return acc + cur.length
    }, 0)
  }, [playlist])

  const totalTimeInMinutesPlusFiveFloor = useMemo(() => {
    const minutes = Math.floor(totalTimeInSeconds / 60) + 5
    return `${minutes}分`
  }, [totalTimeInSeconds])

  const totalTimeInHH_MM_SS = useMemo(() => {
    const hours = Math.floor(totalTimeInSeconds / 3600)
    const minutes = Math.floor((totalTimeInSeconds % 3600) / 60)
    const seconds = totalTimeInSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')} + 5分`
  }, [totalTimeInSeconds])

  const handleAdd = () => {
    const newItem = { id: nanoid(), title: '', length: 0 }
    setPlaylist([newItem, ...playlist])
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
          <div className="flex flex-col gap-4 mb-4 font-bold">
            {playlist.map((item, index) => (
              <div
                key={`${item.id}_${index}`}
                className="flex items-center w-full font-bold"
              >
                <div className="flex-center gap-4">
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
                  {item.id === '0' ? (
                    <>
                      <p className="font-bold w-[20rem]">{item.title}</p>
                      <p>
                        {item.length / 60}
                        <strong className="font-bold">分</strong>
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-[20rem]">
                        <Select
                          options={playListOptions}
                          value={playListOptions.find(
                            (option) => option.label === item.title
                          )}
                          onChange={(option) =>
                            setPlaylist((cur) => {
                              const newPlaylist = [...cur]
                              newPlaylist[index].title = option.label
                              newPlaylist[index].id = option.value
                              newPlaylist[index].length = playlistData.find(
                                (item) => item.id === option.value
                              )?.length
                              return newPlaylist
                            })
                          }
                        />
                      </div>
                      <p>
                        {playlist[index]?.length}
                        <strong className="font-bold">秒</strong>
                      </p>
                    </>
                  )}
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
        <p className="space-x-2">
          <strong className="font-bold">
            Total: {totalTimeInMinutesPlusFiveFloor}
          </strong>
          <span className="italic">( {totalTimeInHH_MM_SS} )</span>
        </p>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-10"
        >
          +
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-md w-1/4"
        >
          確認
        </button>
      </div>
    </div>
  )
}
