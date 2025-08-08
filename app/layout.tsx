import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { kkKZ } from '@clerk/localizations'
import ClientProviders from '@/components/client-providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MobFrame - Мобилографтар платформасы',
  description:
    'Қазақстан мен ТМД елдеріндегі мобилографтар, видеографтар және SMM мамандарының платформасы',
  generator: 'v0.dev',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={kkKZ}>
      <html lang="kk" suppressHydrationWarning>
        <body className={inter.className}>
          <ClientProviders>{children}</ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}
