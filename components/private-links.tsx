"use client"

import { useState } from "react"
import { Eye, Download, Copy, Lock, Plus, CreditCard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const mockPrivateLinks = [
  {
    id: 1,
    title: 'Корпоративтік видео - ТОО "Стиль"',
    type: "video",
    viewLink: "https://mobframe.kz/private/view/abc123",
    downloadLink: "https://mobframe.kz/private/download/abc123",
    views: 5,
    downloads: 2,
    expiresAt: "2024-02-15",
    isActive: true,
    price: 5000,
  },
  {
    id: 2,
    title: "Үйлену фотосессиясы - Айгүл",
    type: "photo",
    viewLink: "https://mobframe.kz/private/view/def456",
    downloadLink: "https://mobframe.kz/private/download/def456",
    views: 12,
    downloads: 8,
    expiresAt: "2024-02-20",
    isActive: true,
    price: 3000,
  },
]

export default function PrivateLinks() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newLink, setNewLink] = useState({
    title: "",
    type: "video",
    price: "",
    expiryDays: "7",
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    console.log("Copied to clipboard:", text)
  }

  const createNewLink = async () => {
    const linkPrice = Number.parseInt(newLink.price)
    if (isNaN(linkPrice) || linkPrice <= 0) {
      alert("Бағаны дұрыс енгізіңіз.")
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
          amount: linkPrice * 100, // Stripe тиынмен қабылдайды
          name: `Жабық сілтеме: ${newLink.title}`,
          description: `Түрі: ${newLink.type}, Мерзімі: ${newLink.expiryDays} күн`,
          successUrl: `${window.location.origin}/profile?payment=success`,
          cancelUrl: `${window.location.origin}/profile?payment=cancelled`,
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

    setShowCreateModal(false)
    setNewLink({ title: "", type: "video", price: "", expiryDays: "7" })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Жабық сілтемелер</h3>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 h-7 px-2 text-xs">
              <Plus className="w-3 h-3 mr-1" />
              Жасау
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90%] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Жаңа жабық сілтеме
              </DialogTitle>
              <p className="text-xs text-muted-foreground">Жабық сілтеме жасау ақылы қызмет</p>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Атауы</label>
                <Input
                  placeholder="Жоба атауы"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Түрі</label>
                <Select value={newLink.type} onValueChange={(value) => setNewLink({ ...newLink, type: value })}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Видео</SelectItem>
                    <SelectItem value="photo">Фото</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Бағасы (₸)</label>
                <Input
                  placeholder="5000"
                  value={newLink.price}
                  onChange={(e) => setNewLink({ ...newLink, price: e.target.value })}
                  className="h-8 text-xs"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Мерзімі</label>
                <Select
                  value={newLink.expiryDays}
                  onValueChange={(value) => setNewLink({ ...newLink, expiryDays: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 күн</SelectItem>
                    <SelectItem value="7">7 күн</SelectItem>
                    <SelectItem value="30">30 күн</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createNewLink} className="w-full bg-purple-600 hover:bg-purple-700 h-8 text-xs">
                Төлеп жасау
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {mockPrivateLinks.map((link) => (
          <Card key={link.id} className="bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xs">{link.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={link.type === "video" ? "default" : "secondary"} className="text-xs">
                      {link.type === "video" ? "Видео" : "Фото"}
                    </Badge>
                    <Badge variant={link.isActive ? "default" : "destructive"} className="text-xs">
                      {link.isActive ? "Белсенді" : "Мерзімі өтті"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{link.price} ₸</p>
                  <Lock className="w-3 h-3 text-purple-400 mx-auto mt-1" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                <div className="text-center">
                  <p className="font-bold">{link.views}</p>
                  <p className="text-muted-foreground">Көрулер</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{link.downloads}</p>
                  <p className="text-muted-foreground">Жүктеулер</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">Мерзімі: {link.expiresAt}</p>

              <div className="space-y-2">
                {/* View Link */}
                <div>
                  <label className="flex items-center gap-1 text-xs font-medium mb-1">
                    <Eye className="w-3 h-3" />
                    Бір реттік көру
                  </label>
                  <div className="flex gap-1">
                    <Input value={link.viewLink} readOnly className="h-7 text-xs" />
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(link.viewLink)}
                      className="h-7 px-2 bg-gray-600 hover:bg-gray-500"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Download Link */}
                <div>
                  <label className="flex items-center gap-1 text-xs font-medium mb-1">
                    <Download className="w-3 h-3" />
                    Толық жүктеу
                  </label>
                  <div className="flex gap-1">
                    <Input value={link.downloadLink} readOnly className="h-7 text-xs" />
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(link.downloadLink)}
                      className="h-7 px-2 bg-gray-600 hover:bg-gray-500"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
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
