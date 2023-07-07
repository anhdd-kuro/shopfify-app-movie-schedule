import { ReactComponent as Seat1 } from './seat1.svg'
import { ReactComponent as Seat2 } from './seat.svg'

export default function Screen({ id = 1 }: { id?: number }) {
  return (
    <div className="flex-center flex-col">
      {id === 1 && <Seat1 className="flex-center screenImg" />}
      {id === 2 && <Seat2 className="flex-center screenImg" />}
    </div>
  )
}
