"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share, MoreHorizontal, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockVideos = [
  {
    id: 1,
    author: "Айдар Қасымов",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "Алматы түнгі көрінісі",
    likes: 1234,
    comments: 89,
    thumbnail: "/placeholder.svg?height=400&width=300",
    duration: "2:34",
  },
  {
    id: 2,
    author: "Сәуле Нұрланова",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "Табиғат фотосессиясы",
    likes: 856,
    comments: 45,
    thumbnail: "/placeholder.svg?height=400&width=300",
    duration: "1:45",
  },
  {
    id: 3,
    author: "Ерлан Медиа",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "Корпоративтік видео",
    likes: 2341,
    comments: 156,
    thumbnail: "/placeholder.svg?height=400&width=300",
    duration: "3:12",
  },
]

export default function VideoFeed() {
  const [likedVideos, setLikedVideos] = useState<number[]>([])

  const toggleLike = (videoId: number) => {
    setLikedVideos((prev) => (prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]))
  }

  const handleProfileClick = (author: string) => {
    // Navigate to profile page
    console.log(`Navigate to ${author}'s profile`)
  }

  return (
    <div className="px-4">
      <h2 className="text-lg font-semibold mb-4">Жоғары рейтингті видеолар</h2>
      <div className="space-y-6">
        {mockVideos.map((video) => (
          <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden">
            {/* Video Thumbnail */}
            <div className="relative aspect-[4/5] bg-gray-700">
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="rounded-full bg-black/50 hover:bg-black/70">
                  <Play className="w-8 h-8 text-white" />
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">{video.duration}</div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handleProfileClick(video.author)}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={video.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{video.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">{video.author}</p>
                    <p className="text-sm text-gray-400">{video.title}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(video.id)}
                    className={`flex items-center gap-2 ${
                      likedVideos.includes(video.id) ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedVideos.includes(video.id) ? "fill-current" : ""}`} />
                    <span>{video.likes + (likedVideos.includes(video.id) ? 1 : 0)}</span>
                  </Button>

                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-400">
                    <MessageCircle className="w-5 h-5" />
                    <span>{video.comments}</span>
                  </Button>
                </div>

                <Button variant="ghost" size="sm" className="text-gray-400">
                  <Share className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
