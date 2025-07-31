"use client"

import { useState } from "react"
import { Play, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryPageProps {
  categoryId: string | null
}

const categoryContent = {
  music: [
    {
      id: 1,
      title: "Ambient Chill",
      author: "SoundMaker",
      duration: "3:45",
      price: 2000,
      rating: 4.8,
      downloads: 1234,
      preview: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      title: "Upbeat Corporate",
      author: "AudioPro",
      duration: "2:30",
      price: 1500,
      rating: 4.6,
      downloads: 856,
      preview: "/placeholder.svg?height=80&width=80",
    },
  ],
  lut: [
    {
      id: 1,
      title: "Cinematic Orange",
      author: "ColorGrader",
      price: 3000,
      rating: 4.9,
      downloads: 432,
      preview: "/placeholder.svg?height=80&width=80",
    },
  ],
  sfx: [
    {
      id: 1,
      title: "Rain Ambience",
      author: "NatureSounds",
      duration: "10:00",
      price: 1000,
      rating: 4.7,
      downloads: 678,
      preview: "/placeholder.svg?height=80&width=80",
    },
  ],
  angles: [
    {
      id: 1,
      title: "Low Angle Shot",
      author: "CameraExpert",
      price: 2500,
      rating: 4.8,
      downloads: 234,
      preview: "/placeholder.svg?height=80&width=80",
    },
  ],
  plans: [
    {
      id: 1,
      title: "Close-up Plan",
      author: "FrameMaster",
      price: 2000,
      rating: 4.6,
      downloads: 345,
      preview: "/placeholder.svg?height=80&width=80",
    },
  ],
  compositions: [
    {
      id: 1,
      title: "Rule of Thirds",
      author: "CompoExpert",
      price: 3500,
      rating: 4.9,
      downloads: 567,
      preview: "/placeholder.svg?height=80&width=80",
    },
  ],
}

export default function CategoryPage({ categoryId }: CategoryPageProps) {
  const [selectedFilter, setSelectedFilter] = useState("all")

  if (!categoryId) return null

  const items = categoryContent[categoryId as keyof typeof categoryContent] || []

  const handlePurchase = (item: any) => {
    alert(`${item.title} сатып алу үшін ${item.price} ₸ төлеу керек`)
  }

  const handlePreview = (item: any) => {
    console.log("Previewing:", item)
  }

  return (
    <div className="p-3 space-y-3">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          size="sm"
          variant={selectedFilter === "all" ? "default" : "outline"}
          onClick={() => setSelectedFilter("all")}
          className="text-xs whitespace-nowrap"
        >
          Барлығы
        </Button>
        <Button
          size="sm"
          variant={selectedFilter === "popular" ? "default" : "outline"}
          onClick={() => setSelectedFilter("popular")}
          className="text-xs whitespace-nowrap"
        >
          Танымал
        </Button>
        <Button
          size="sm"
          variant={selectedFilter === "new" ? "default" : "outline"}
          onClick={() => setSelectedFilter("new")}
          className="text-xs whitespace-nowrap"
        >
          Жаңа
        </Button>
      </div>

      {/* Content Grid */}
      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="bg-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.preview || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm truncate">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.author}</p>
                      {item.duration && <p className="text-xs text-muted-foreground">{item.duration}</p>}
                    </div>
                    <div className="text-right ml-2">
                      <p className="font-medium text-sm">{item.price} ₸</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{item.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{item.downloads} жүктеу</p>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(item)}
                        className="h-7 px-2 text-xs"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Көру
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handlePurchase(item)}
                        className="bg-purple-600 hover:bg-purple-700 h-7 px-2 text-xs"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Алу
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
