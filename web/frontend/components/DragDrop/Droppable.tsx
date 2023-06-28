/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx } from 'clsx'
import { useDragDropManager, useDrop } from 'react-dnd'
import { memo, useEffect, useState } from 'react'

export type DroppableItem = {
  id: string
  accept: string[]
}

type Props = DroppableItem & {
  onDrop?: (item: any) => void
  onHover?: (item: any) => void
  Wrapper: React.FC<{
    canDrop: boolean
    isAnyItemDragging?: boolean
    isOver?: boolean
  }>
} & (
    | {
        dropAnimation: true
        DragItemForAnimation: React.FC<{ lastDroppedItem: any }>
      }
    | {
        dropAnimation?: false
        DragItemForAnimation?: undefined
      }
  )

export const _Droppable: React.FC<Props> = ({
  id,
  accept,
  onDrop,
  onHover,
  Wrapper,
  DragItemForAnimation,
  dropAnimation,
}) => {
  const dragDropManager = useDragDropManager()

  const [animation, setAnimation] = useState(false)
  const [lastDroppedItem, setLastDroppedItem] = useState()

  useEffect(() => {
    if (!animation) return

    const timer = setTimeout(() => {
      setAnimation(false)
    }, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [animation])

  const [{ canDrop, isAnyItemDragging, isOver }, drop] = useDrop(
    () => ({
      accept,
      drop: (item) => {
        onDrop?.(item)
        setAnimation(true)
        setLastDroppedItem(item)
      },
      hover: onHover,
      collect: (monitor: any) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
          isAnyItemDragging: dragDropManager.getMonitor().isDragging(),
        }
      },
    }),
    [accept, onDrop, onHover]
  )

  return (
    <div id={id} ref={drop} className="group relative h-full w-full">
      {dropAnimation && (
        <div
          className={clsx(
            'absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full',
            animation
              ? 'top-0 left-1/2 scale-100'
              : 'top-1/2 left-1/2 scale-0 duration-500 ease-out'
          )}
        >
          <DragItemForAnimation lastDroppedItem={lastDroppedItem} />
        </div>
      )}
      <Wrapper
        canDrop={canDrop}
        isAnyItemDragging={isAnyItemDragging}
        isOver={isOver}
      />
    </div>
  )
}

export const Droppable = memo(_Droppable)
