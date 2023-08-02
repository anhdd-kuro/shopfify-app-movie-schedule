import { useCallback, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import { Draggable, Droppable } from './DragDrop'
import Select from 'react-select'
import { useAppQuery } from '../hooks'
import { toast } from 'react-toastify'
import { Movie } from '../pages/schedule.data'

export type PlaylistItem = {
  handle: string
  title: string
  length: number
}

type PlayList = {
  title: string
  list: PlaylistItem[]
  screen_1_check_status: string
  screen_1_volume: string
  screen_2_check_status: string
  screen_2_volume: string
  start: string
  end: string
}

type PlaylistProps = {
  onSubmit: (playlist: PlaylistItem[]) => void
  startDate?: Date
  movie: Movie
}

export default function Playlist({
  onSubmit,
  startDate,
  movie,
}: PlaylistProps) {
  const [playlist, setPlaylist] = useState<PlayList[]>([])

  const selectedPlaylist = useMemo<PlayList>(() => {
    if (!startDate) return

    return playlist.find((list) => {
      const start = new Date(list.start)
      const end = new Date(list.end)
      return startDate >= start && startDate <= end
    })
  }, [startDate, playlist])

  const { isLoading, isFetching } = useAppQuery({
    url: `/api/trailer_set?query=display_name:ハマのドン`,
    reactQueryOptions: {
      enabled: !!startDate && !!movie,
      onSuccess: (result: any) => {
        const _playlist: PlayList[] = result.data.metaobjects.nodes.map(
          (node: any) => {
            const fields = node.fields.reduce((acc: any, field: any) => {
              if (field.key !== 'items' && field.key !== 'movie')
                acc[field.key] = field.value
              else acc[field.key] = field.references
              return acc
            }, {})

            const list = fields.items
              ? fields.items.edges.map((item: any) => {
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
              ...fields,
              list,
            }
          }
        )

        setPlaylist(_playlist)
      },
    },
  })

  console.log(playlist, 'playlist')
  console.log(selectedPlaylist, 'selectedPlaylist')

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
      {movie && startDate && (
        <>
          {isLoading || isFetching ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {/*      <select
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
              </select> */}
            </>
          ) : (
            <>
              {selectedPlaylist ? (
                <div className="flex flex-col gap-4 divide-y">
                  <section className="">
                    <h2 className="font-bold text-lg">確認状態</h2>
                    <div className="gap-2 mt-4">
                      {movie.resource.screenId === 1 && (
                        <>
                          <span className="p-2 bg-gray-500 text-white rounded">
                            {selectedPlaylist.screen_1_check_status}
                          </span>
                        </>
                      )}
                      {movie.resource.screenId === 2 && (
                        <>
                          <span className="p-2 bg-gray-500 text-white rounded">
                            {selectedPlaylist.screen_2_check_status}
                          </span>
                          {selectedPlaylist.screen_2_check_status !==
                            'ダブルチェック済み' && (
                            <p className="mt-4 text-red-500 font-bold italic">
                              販売開始にはダブルチェックが必要です ! <br />
                              チェックなしの場合は、チェック状態をクリアしてください。
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </section>
                  <section className="py-4">
                    <h2 className="font-bold text-lg">プレイリスト詳細</h2>
                    <div className="bg-gray-100 py-4 px-8 rounded-lg mt-4">
                      <ol className="font-bold list-decimal divide-y">
                        <li className="py-3">ブザー</li>
                        <li className="py-3">ライトダウン１</li>
                        <li className="py-3">黒映像</li>
                        <li className="py-3 border-black border-dashed">
                          <h3 className="font-bold">予告編リスト</h3>
                          <ol className="space-y-2 mt-2 font-bold list-decimal">
                            {selectedPlaylist.list.map((item, index) => (
                              <li key={index} className="flex justify-between">
                                <h3 className="text-xs">{item.title}</h3>
                                <p className="text-gray-500">{item.length}秒</p>
                              </li>
                            ))}
                          </ol>
                          <p className="mt-4 text-lg text-right">
                            {selectedPlayListTotalLengthMinutesSeconds}
                          </p>
                        </li>
                        <li className="py-3 border-black border-dashed">
                          盗撮防止啓蒙（映画泥棒）
                        </li>
                        <li className="py-3">ライトダウン２</li>
                        <li className="py-3">
                          <div className="flex justify-between">
                            <h3 className="font-bold">本編</h3>
                            <p className="text-xs text-gray-500">{100}分</p>
                          </div>
                        </li>
                        <li className="py-3">黒映像</li>
                        <li className="py-3">ライトアップ</li>
                      </ol>
                    </div>
                  </section>
                  <section className="py-4">
                    <h2 className="font-bold text-lg">追加オプション</h2>
                    <form className="flex flex-col gap-2 mt-2">
                      <label className="flex items-center gap-2" htmlFor="">
                        <input type="checkbox" />
                        <span>BGMなし</span>
                      </label>
                    </form>
                  </section>
                </div>
              ) : (
                <p className="text-red-500 font-bold">
                  開始日に該当するプレイリストがありません
                </p>
              )}
            </>
          )}
        </>
      )}
      {!movie && (
        <>
          <p className="text-red-500 font-bold">作品を選んでください !</p>
        </>
      )}
      {!startDate && (
        <>
          <p className="text-red-500 font-bold">開始日時を設定してください !</p>
        </>
      )}
    </div>
  )
}
