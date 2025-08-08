'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Route Error Boundary:', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full border rounded-lg p-6 bg-background">
        <h1 className="text-xl font-semibold mb-2">Қате пайда болды</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Бет рендерлеу кезінде қателік шықты. Консольді тексеріңіз (F12 → Console).
        </p>
        <pre className="text-xs overflow-auto max-h-48 p-3 bg-muted rounded mb-4">
          {error?.message || 'Белгісіз қате'}
        </pre>
        <div className="flex gap-2">
          <Button onClick={() => reset()}>Қайта көру</Button>
          <Button variant="outline" onClick={() => location.reload()}>
            Бетті қайта жүктеу
          </Button>
        </div>
      </div>
    </main>
  )
}
