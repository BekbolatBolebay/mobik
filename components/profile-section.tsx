"use client"

import { useState } from "react"
import { Settings, Star, MapPin, Camera, Video, Bookmark, Grid, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AuthModal from "@/components/auth-modal"
import PrivateLinks from "@/components/private-links"

const mockReviews = [
  {
    id: 1,
    client: "Айгүл С.",
    rating: 5,
    comment: "Өте сапалы жұмыс! Ұсынамын.",
    date: "2024-01-15",
  },
  {
    id: 2,
    client: "Ерлан М.",
    rating: 4,
    comment: "Жақсы нәтиже, уақытында тапсырды.",
    date: "2024-01-10",
  },
]

export default function ProfileSection() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<any>(null)

  const handleAuth = (userData: any) => {
    setUser(userData)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MobFrame
              </CardTitle>
              <p className="text-sm text-muted-foreground">Платформаға кіру</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 h-9 text-sm"
              >
                Тіркелу / Кіру
              </Button>
            </CardContent>
          </Card>
        </div>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuth={handleAuth} />}
      </>
    )
  }

  return (
    <div className="pb-16">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-24 bg-gradient-to-r from-purple-600 to-pink-600"></div>
        <div className="absolute -bottom-10 left-3">
          <Avatar className="w-20 h-20 border-4 border-background">
            <AvatarImage src="/placeholder.svg?height=80&width=80" />
            <AvatarFallback className="text-lg">{user.name?.[0] || "П"}</AvatarFallback>
          </Avatar>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="absolute top-2 right-2">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Profile Info */}
      <div className="pt-12 px-3">
        <div className="mb-4">
          <h1 className="text-lg font-bold mb-1">{user.name || "Пайдаланушы"}</h1>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Алматы</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>4.8 (156 пікір)</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Кәсіби мобилограф және видеограф. 5 жылдық тәжірибе.</p>

          {/* Services & Pricing */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Card className="bg-card">
              <CardContent className="p-2 text-center">
                <Camera className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                <p className="text-xs font-medium">Фото</p>
                <p className="text-xs text-muted-foreground">15,000 ₸/сағат</p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-2 text-center">
                <Video className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                <p className="text-xs font-medium">Видео</p>
                <p className="text-xs text-muted-foreground">25,000 ₸/сағат</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold">156</p>
              <p className="text-xs text-muted-foreground">Жобалар</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">2.3K</p>
              <p className="text-xs text-muted-foreground">Ізбасарлар</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">45K ₸</p>
              <p className="text-xs text-muted-foreground">Баланс</p>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted h-8">
            <TabsTrigger value="portfolio" className="text-xs">
              <Grid className="w-3 h-3 mr-1" />
              Портфолио
            </TabsTrigger>
            <TabsTrigger value="private" className="text-xs">
              <Link className="w-3 h-3 mr-1" />
              Сілтемелер
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              Пікірлер
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-xs">
              <Bookmark className="w-3 h-3 mr-1" />
              Сақталған
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-3">
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={`/placeholder.svg?height=150&width=150&query=portfolio ${item}`}
                    alt={`Portfolio ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="private" className="mt-3">
            <PrivateLinks />
          </TabsContent>

          <TabsContent value="reviews" className="mt-3">
            <div className="space-y-2">
              {mockReviews.map((review) => (
                <Card key={review.id} className="bg-card">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium">{review.client}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-3">
            <div className="text-center py-8">
              <Bookmark className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Сақталған контент жоқ</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
