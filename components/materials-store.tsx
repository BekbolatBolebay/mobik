"use client"

import { useState } from "react"
import { Music, Volume2, Palette, Play, Download, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const mockMaterials = {
  music: [
    {
      id: 1,
      title: "Ambient Chill",
      author: "SoundMaker",
      duration: "3:45",
      price: 2000, // KZT
      isFree: false,
      preview: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      title: "Upbeat Corporate",
      author: "AudioPro",
      duration: "2:30",
      price: 1500, // KZT
      isFree: false,
      preview: "/placeholder.svg?height=100&width=100",
    },
  ],
  lut: [
    {
      id: 1,
      title: "Cinematic Orange",
      author: "ColorGrader",
      price: 3000, // KZT
      isFree: false,
      preview: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      title: "Vintage Film",
      author: "RetroLook",
      price: 2500, // KZT
      isFree: false,
      preview: "/placeholder.svg?height=100&width=100",
    },
  ],
  sfx: [
    {
      id: 1,
      title: "Rain Ambience",
      author: "NatureSounds",
      duration: "10:00",
      price: 1000, // KZT
      isFree: false,
      preview: "/placeholder.svg?height=100&width=100",
    },
  ],
}

export default function MaterialsStore() {
  const [activeTab, setActiveTab] = useState("music")

  const handlePurchase = async (item: any) => {
    if (item.isFree) {
      alert(`${item.title} тегін жүктелді!`)
      console.log("Free download:", item)
      return
    }

    try {
      const stripe = await stripePromise
      if (!stripe) {
        console.error("Stripe.js failed to load.")
        return
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: item.price * 100, // Stripe тиынмен қабылдайды
          name: item.title,
          description: `Материал: ${item.title} (${item.author})`,
          successUrl: `${window.location.origin}/profile?payment=success`, // Төлем сәтті болғанда
          cancelUrl: `${window.location.origin}/materials?payment=cancelled`, // Төлем тоқтатылғанда
        }),
      })

      const data = await response.json()
      if (response.ok) {
        const result = await stripe.redirectToCheckout({ sessionId: data.sessionId })
        if (result.error) {
          alert(result.error.message)
        }
      } else {
        alert(`Төлем сессиясын жасауда қате: ${data.error || "Белгісіз қате"}`)
      }
    } catch (error) {
      console.error("Төлемді өңдеу қатесі:", error)
      alert("Төлемді өңдеу кезінде қате пайда болды. Қайталап көріңіз.")
    }
  }

  const handlePreview = (item: any) => {
    console.log("Previewing:", item)
  }

  return (
    <div className="p-3 pb-16">
      <h1 className="text-lg font-bold mb-4">Материалдар дүкені</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-muted h-9 mb-4">
          <TabsTrigger value="music" className="flex items-center gap-1 text-xs">
            <Music className="w-3 h-3" />
            Музыка
          </TabsTrigger>
          <TabsTrigger value="lut" className="flex items-center gap-1 text-xs">
            <Palette className="w-3 h-3" />
            LUT
          </TabsTrigger>
          <TabsTrigger value="sfx" className="flex items-center gap-1 text-xs">
            <Volume2 className="w-3 h-3" />
            SFX
          </TabsTrigger>
        </TabsList>

        <TabsContent value="music">
          <div className="space-y-2">
            {mockMaterials.music.map((item) => (
              <Card key={item.id} className="bg-card">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-purple-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm truncate">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.author}</p>
                          <p className="text-xs text-muted-foreground">{item.duration}</p>
                        </div>
                        <div className="text-right ml-2">
                          {item.isFree ? (
                            <Badge className="bg-green-600 text-xs">Тегін</Badge>
                          ) : (
                            <p className="font-medium text-sm">{item.price} ₸</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(item)}
                          className="h-7 px-2 text-xs"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Тыңдау
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handlePurchase(item)}
                          className="bg-purple-600 hover:bg-purple-700 h-7 px-2 text-xs"
                        >
                          {item.isFree ? (
                            <>
                              <Download className="w-3 h-3 mr-1" />
                              Жүктеу
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Сатып алу
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lut">
          <div className="space-y-2">
            {mockMaterials.lut.map((item) => (
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
                        </div>
                        <div className="text-right ml-2">
                          {item.isFree ? (
                            <Badge className="bg-green-600 text-xs">Тегін</Badge>
                          ) : (
                            <p className="font-medium text-sm">{item.price} ₸</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(item)}
                          className="h-7 px-2 text-xs"
                        >
                          Көру
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handlePurchase(item)}
                          className="bg-purple-600 hover:bg-purple-700 h-7 px-2 text-xs"
                        >
                          {item.isFree ? (
                            <>
                              <Download className="w-3 h-3 mr-1" />
                              Жүктеу
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Сатып алу
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sfx">
          <div className="space-y-2">
            {mockMaterials.sfx.map((item) => (
              <Card key={item.id} className="bg-card">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Volume2 className="w-6 h-6 text-blue-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm truncate">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.author}</p>
                          <p className="text-xs text-muted-foreground">{item.duration}</p>
                        </div>
                        <div className="text-right ml-2">
                          {item.isFree ? (
                            <Badge className="bg-green-600 text-xs">Тегін</Badge>
                          ) : (
                            <p className="font-medium text-sm">{item.price} ₸</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(item)}
                          className="h-7 px-2 text-xs"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Тыңдау
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handlePurchase(item)}
                          className="bg-purple-600 hover:bg-purple-700 h-7 px-2 text-xs"
                        >
                          {item.isFree ? (
                            <>
                              <Download className="w-3 h-3 mr-1" />
                              Жүктеу
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Сатып алу
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
