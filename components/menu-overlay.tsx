"use client"

import { X, Settings, HelpCircle, Info, Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MenuOverlayProps {
  onClose: () => void
}

const menuItems = [
  { icon: Settings, label: "Параметрлер", id: "settings" },
  { icon: HelpCircle, label: "Көмек", id: "help" },
  { icon: Info, label: "Біз туралы", id: "about" },
  { icon: Shield, label: "Құпиялылық", id: "privacy" },
  { icon: FileText, label: "Шарттар", id: "terms" },
]

export default function MenuOverlay({ onClose }: MenuOverlayProps) {
  const handleMenuClick = (id: string) => {
    console.log(`Navigate to ${id}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-full w-80 bg-background border-l">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Меню</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleMenuClick(item.id)}
                  className="w-full justify-start h-12"
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              )
            })}
          </div>

          {/* Placeholder Content Area */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Қосымша ақпарат</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Бұл жерге сіз қажетті контентті қоса аласыз. Мысалы:</p>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>• Жаңалықтар</li>
                <li>• Акциялар</li>
                <li>• Пайдалы кеңестер</li>
                <li>• Байланыс ақпараты</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
