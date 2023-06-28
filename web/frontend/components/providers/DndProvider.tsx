import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

type Props = {
  children: React.ReactElement | React.ReactElement[]
}

/**
 * Sets up the QueryClientProvider from react-query.
 * @desc See: https://react-query.tanstack.com/reference/QueryClientProvider#_top
 */
export default function ReactDndProvider({ children }: Props) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>
}
