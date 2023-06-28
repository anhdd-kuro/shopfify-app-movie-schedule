/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDrag, useDrop } from 'react-dnd'
import { memo } from 'react'

export type DraggableItem<T = Record<string, never>> = {
  id: string
  type: string
  dropItemId?: string
} & T

type Props<T> = {
  item: DraggableItem<T>
  allAcceptTypes: string[]
  onHover?: (item: any) => void
  Wrapper: React.FC<{ isDragging: boolean; item: DraggableItem<T> }>
}

export const Draggable = memo(function _CDraggable<T>({
  item,
  allAcceptTypes,
  onHover,
  Wrapper,
}: Props<T>) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: item.type,
      item,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      // end(item, monitor) {},
      isDragging(monitor) {
        return item.id === monitor.getItem().id
      },
    }),
    [item]
  )

  const [, drop] = useDrop(
    () => ({
      accept: allAcceptTypes,
      hover: onHover,
    }),
    [allAcceptTypes, onHover]
  )

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="cursor-grab opacity-[0.999]"
    >
      <Wrapper isDragging={isDragging} item={item} />
    </div>
  )
})
