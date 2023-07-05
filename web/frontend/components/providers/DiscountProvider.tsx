import { AppProvider } from '@shopify/discount-app-components'

export function DiscountProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider locale="ja-JP" ianaTimezone="Japan">
      {children}
    </AppProvider>
  )
}
