import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { kkKZ } from "@clerk/localizations"
import GoogleAnalytics from "@/components/google-analytics"
import { initOneSignal } from "@/lib/onesignal"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MobFrame - Мобилографтар платформасы",
  description: "Қазақстан мен ТМД елдеріндегі мобилографтар, видеографтар және SMM мамандарының платформасы",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // OneSignal-ды клиент тарапында инициализациялау
  if (typeof window !== "undefined") {
    initOneSignal()
  }

  // Clerk кілттерін тексеру
  const clerkPublishableKey = "pk_test_bXVzaWNhbC10b3J0b2lzZS03LmNsZXJrLmFjY291bnRzLmRldiQ"
  const hasClerkKeys = "sk_test_INIz7PZlZZN3l21aoH6hAAXDswtreezRhRlC7PQ9Pm"

  if (!hasClerkKeys) {
    console.warn("Clerk keys not configured. Authentication will not work.")
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      localization={kkKZ}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#8b5cf6",
        },
      }}
    >
      <html lang="kk" suppressHydrationWarning>
        <body className={inter.className}>
          <Suspense fallback={null}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
            <GoogleAnalytics />
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  )
}
