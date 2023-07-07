import { BrowserRouter } from 'react-router-dom'
import { NavigationMenu } from '@shopify/app-bridge-react'
import Routes from './Routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'moment/dist/locale/ja'

import { AppBridgeProvider, QueryProvider, PolarisProvider } from './components'
import ReactDndProvider from './components/providers/DndProvider'
import '@shopify/discount-app-components/build/esm/styles.css'
import '@shopify/polaris/build/esm/styles.css'
import 'react-tooltip/dist/react-tooltip.css'

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob('./pages/**/!(*.test.[jt]sx)*.([jt]sx)', {
    eager: true,
  })
  console.log(process?.env)

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <ReactDndProvider>
              <NavigationMenu
                navigationLinks={[
                  {
                    label: 'スケージュール',
                    destination: '/schedule',
                  },
                  {
                    label: '座席図',
                    destination: '/seats',
                  },
                  {
                    label: 'Show Detail',
                    destination: '/shows',
                  },
                  // {
                  //   label: 'Discount',
                  //   destination: `discount/new`,
                  // },
                ]}
              />
              <Routes pages={pages} />
              <ToastContainer autoClose={1000} position="bottom-right" />
            </ReactDndProvider>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  )
}
