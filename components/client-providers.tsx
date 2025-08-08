'use client'

import { useEffect } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import GoogleAnalytics from '@/components/google-analytics'
import { initOneSignal } from '@/lib/onesignal'

type Props = {
  children: React.ReactNode
}

export default function ClientProviders({ children }: Props) {
  useEffect(() => {
    // Initialize OneSignal on the client only
    try {
      initOneSignal()
    } catch (e) {
      // Avoid crashing the app if OneSignal fails to init
      console.error('OneSignal init error:', e)
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
      {/* Keep GA at the end so it doesn't block UI */}
      <GoogleAnalytics />
    </ThemeProvider>
  )
}
