"use client"

import { useState, useEffect } from "react"
import { Search, Grid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const mockResults = [
  {
    id: 1,
    type: "video",
    title: "Алматы түнгі көрінісі",
    author: "Айдар Қасымов",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Видео",
    likes: 1234,
  },
  {
    id: 2,
    type: "photo",
    title: "Портрет фотосессиясы",
    author: "Сәуле Нұрланова",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Фото",
    likes: 856,
  },
  {
    id: 3,
    type: "lut",
    title: "Cinematic LUT пресет",
    author: "Ерлан Медиа",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "LUT",
    likes: 432,
  },
]

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [filteredResults, setFilteredResults] = useState(mockResults)

  // Add useEffect to filter results when search query or filters change
  useEffect(() => {
    let filtered = mockResults

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((item) => item.type === category)
    }

    // Sort results
    if (sortBy === "popular") {
      filtered = filtered.sort((a, b) => b.likes - a.likes)
    } else if (sortBy === "recent") {
      filtered = filtered.sort((a, b) => b.id - a.id)
    }

    setFilteredResults(filtered)
  }, [searchQuery, category, sortBy])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
      {/* Search Header */}
      <div className="sticky top-0 bg-gray-900 pb-4 mb-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Іздеу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">Барлығы</SelectItem>
              <SelectItem value="video">Видео</SelectItem>
              <SelectItem value="photo">Фото</SelectItem>
              <SelectItem value="music">Музыка</SelectItem>
              <SelectItem value="lut">LUT</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="popular">Танымал</SelectItem>
              <SelectItem value="recent">Жаңа</SelectItem>
              <SelectItem value="liked">Ұнатылған</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 ml-auto">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex items-center gap-2">
          {category !== "all" && (
            <Badge variant="secondary" className="bg-purple-600">
              {category}
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="bg-purple-600">
              "{searchQuery}"
            </Badge>
          )}
        </div>
      </div>

      {/* Results */}
      <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
        {filteredResults.length > 0 ? (
          filteredResults.map((item) => (
            <div
              key={item.id}
              className={`bg-gray-800 rounded-lg overflow-hidden ${viewMode === "list" ? "flex gap-4" : ""}`}
            >
              <div className={viewMode === "list" ? "w-32 h-24" : "aspect-[4/3]"}>
                <img
                  src={item.thumbnail || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white text-sm">{item.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 mb-2">{item.author}</p>
                <p className="text-xs text-gray-500">{item.likes} ұнату</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Нәтиже табылмады</p>
          </div>
        )}
      </div>
    </div>
  )
}
