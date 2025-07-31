"use client"
import { useState, useEffect } from "react"
import { Search, Music, Volume2, Palette, Camera, Layout, Layers, Sun, Moon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import VideoFeed from "@/components/video-feed"
import BottomNavigation from "@/components/bottom-navigation"
import JobsSection from "@/components/jobs-section"
import UploadSection from "@/components/upload-section"
import MessagesSection from "@/components/messages-section"
import ProfileSection from "@/components/profile-section"
import SearchSection from "@/components/search-section"
import MaterialsStore from "@/components/materials-store"
import JobPosting from "@/components/job-posting"
import CategoryPage from "@/components/category-page"
import { useTheme } from "next-themes"

const categories = [
  { id: "music", icon: Music, label: "Музыка", color: "bg-purple-500" },
  { id: "sfx", icon: Volume2, label: "Дыбыс эффектілері", color: "bg-blue-500" },
  { id: "lut", icon: Palette, label: "LUT пресеттер", color: "bg-green-500" },
  { id: "angles", icon: Camera, label: "Камера бұрыштары", color: "bg-red-500" },
  { id: "plans", icon: Layout, label: "Планы", color: "bg-yellow-500" },
  { id: "compositions", icon: Layers, label: "Композициялар", color: "bg-pink-500" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false) // New state for client-side mounting

  useEffect(() => {
    setMounted(true) // Set to true once component mounts on client
  }, [])

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage("category")
  }

  const handleBackClick = () => {
    if (currentPage === "category") {
      setSelectedCategory(null)
      setCurrentPage("home")
    } else if (currentPage === "job-posting") {
      setCurrentPage("jobs")
    } else if (currentPage === "search") {
      setCurrentPage("home")
    }
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case "home":
        return "MobFrame"
      case "jobs":
        return "Жұмыстар"
      case "upload":
        return "Жариялау"
      case "messages":
        return "Хабарлар"
      case "profile":
        return "Профиль"
      case "search":
        return "Іздеу"
      case "materials":
        return "Материалдар"
      case "job-posting":
        return "Жұмыс жариялау"
      case "category":
        const category = categories.find((c) => c.id === selectedCategory)
        return category?.label || "Категория"
      default:
        return "MobFrame"
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <>
            {/* Categories Grid */}
            <div className="p-3">
              <h2 className="text-base font-semibold mb-3">Категориялар</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {categories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <Button
                      key={category.id}
                      variant="ghost"
                      onClick={() => handleCategoryClick(category.id)}
                      className={`${category.color} hover:opacity-80 h-16 flex flex-col items-center justify-center gap-1 text-white text-xs`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-center leading-tight">{category.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
            <VideoFeed />
          </>
        )
      case "jobs":
        return <JobsSection onCreateJob={() => setCurrentPage("job-posting")} />
      case "upload":
        return <UploadSection />
      case "messages":
        return <MessagesSection />
      case "profile":
        return <ProfileSection />
      case "search":
        return <SearchSection />
      case "materials":
        return <MaterialsStore />
      case "job-posting":
        return <JobPosting />
      case "category":
        return <CategoryPage categoryId={selectedCategory} />
      default:
        return <VideoFeed />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {currentPage !== "home" &&
                currentPage !== "search" && ( // "Іздеу" бетінде де артқа қайту батырмасы болсын
                  <Button variant="ghost" size="sm" onClick={handleBackClick}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
            </Button>
          </div>
          {/* Search Bar - only on home and search pages */}
          {(currentPage === "home" || currentPage === "search") && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Іздеу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setCurrentPage("search")}
                className="pl-8 h-9 text-sm"
              />
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      {renderCurrentPage()}
      {/* Bottom Navigation */}
      <BottomNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  )
}
