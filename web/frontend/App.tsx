import { BrowserRouter } from 'react-router-dom'
import { NavigationMenu } from '@shopify/app-bridge-react'
import Routes from './Routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AppBridgeProvider, QueryProvider, PolarisProvider } from './components'

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob('./pages/**/!(*.test.[jt]sx)*.([jt]sx)', {
    eager: true,
  })

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: 'Schedule',
                  destination: '/schedule',
                },
                {
                  label: 'Show Detail',
                  destination: '/shows',
                },
              ]}
            />
            <Routes pages={pages} />
            <ToastContainer autoClose={1000} />
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  )
}
