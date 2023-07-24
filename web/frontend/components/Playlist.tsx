import { useCallback, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import { Draggable, Droppable } from './DragDrop'
import Select from 'react-select'
import { useAppQuery } from '../hooks'

export type PlaylistItem = {
  handle: string
  title: string
  length: number
}

type PlayList = {
  title: string
  list: PlaylistItem[]
}

type PlaylistProps = {
  onSubmit: (playlist: PlaylistItem[]) => void
}

export default function Playlist({ onSubmit }: PlaylistProps) {
  const [playlist, setPlaylist] = useState<PlayList[]>([])

  const [selectedPlaylist, setSelectedPlaylist] = useState<PlayList>()

  const { data } = useAppQuery({
    url: '/api/playlist',
    reactQueryOptions: {
      onSuccess: (result: any) => {
        const _playlist: PlayList[] = result.data.metaobjects.nodes.map(
          (node: any) => {
            const fields = node.fields.reduce((acc: any, field: any) => {
              if (field.key !== 'list') acc[field.key] = field.value
              else acc[field.key] = field.references
              return acc
            }, {})

            const list = fields.list
              ? fields.list.edges.map((item: any) => {
                  const itemFields = item.node.fields.reduce(
                    (acc: any, field: any) => {
                      acc[field.key] = field.value
                      return acc
                    },
                    {}
                  )

                  return {
                    handle: item.node.handle,
                    ...itemFields,
                  }
                })
              : []

            return {
              title: fields.title,
              list,
            }
          }
        )

        setPlaylist(_playlist)
      },
    },
  })

  const selectedPlayListTotalLengthMinutesSeconds = useMemo(() => {
    if (!selectedPlaylist) return '0:00'
    const totalSeconds = selectedPlaylist.list.reduce((acc, item) => {
      return +item.length + acc
    }, 0)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}分${`${seconds}`.padStart(2, '0')}秒`
  }, [selectedPlaylist])

  return (
    <div className="space-y-4">
      <select
        value={selectedPlaylist?.title || ''}
        className="border p-2 rounded"
        onChange={(e) => {
          const selected = playlist.find(
            (list) => list.title === e.target.value
          )
          setSelectedPlaylist(selected)
        }}
      >
        <option value="">未設定</option>
        {playlist.map((list, index) => (
          <option key={index} value={list.title}>
            {list.title}
          </option>
        ))}
      </select>
      <div className="bg-gray-100 p-4 rounded-lg">
        {selectedPlaylist && (
          <>
            <ul>
              {selectedPlaylist?.list.map((item, index) => (
                <li key={index} className="flex justify-between py-2">
                  <h2 className="text-medium font-bold">{item.title}</h2>
                  <p className="text-gray-500">{item.length}秒</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-lg text-right">
              {selectedPlayListTotalLengthMinutesSeconds}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
