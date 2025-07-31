"use client"

import { Home, Briefcase, Plus, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: Home, label: "Басты", id: "home" },
  { icon: Briefcase, label: "Жұмыстар", id: "jobs" },
  { icon: Plus, label: "Жариялау", id: "upload" },
  { icon: MessageCircle, label: "Хабарлар", id: "messages" },
  { icon: User, label: "Профиль", id: "profile" },
]

interface BottomNavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function BottomNavigation({ currentPage, onPageChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t h-16">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = currentPage === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-2 h-12 ${
                isActive ? "text-purple-400" : "text-muted-foreground"
              }`}
            >
              <IconComponent
                className={`w-4 h-4 ${item.id === "upload" ? "bg-purple-500 rounded-full p-1 w-6 h-6" : ""}`}
              />
              <span className="text-xs">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
