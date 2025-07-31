"use client"

import { useState } from "react"
import { MapPin, DollarSign, Clock, FileText, Camera, Video, Megaphone, CreditCard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const serviceTypes = [
  { id: "photo", label: "Фотосессия", icon: Camera },
  { id: "video", label: "Видеосъемка", icon: Video },
  { id: "smm", label: "SMM қызметтері", icon: Megaphone },
]

export default function JobPosting() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceType: "",
    budget: "",
    location: "",
    deadline: "",
    isPremium: false,
  })

  const handleSubmit = async () => {
    const baseCost = 3000 // Base cost for posting a job
    const premiumCost = formData.isPremium ? 5000 : 0
    const totalCost = baseCost + premiumCost

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
          amount: totalCost * 100, // Stripe тиынмен қабылдайды
          name: `Жұмыс жариялау: ${formData.title}`,
          description: `Негізгі жариялау (${baseCost} ₸) ${formData.isPremium ? `+ Таңдаулы жариялау (${premiumCost} ₸)` : ""}`,
          successUrl: `${window.location.origin}/profile?payment=success`,
          cancelUrl: `${window.location.origin}/job-posting?payment=cancelled`,
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

  return (
    <div className="p-3 pb-20">
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Жаңа тапсырыс (3,000 ₸)
          </CardTitle>
          <p className="text-xs text-muted-foreground">Жұмыс жариялау ақылы қызмет</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service Type Selection */}
          <div>
            <label className="block text-xs font-medium mb-2">Қызмет түрі</label>
            <div className="grid grid-cols-1 gap-2">
              {serviceTypes.map((service) => {
                const IconComponent = service.icon
                return (
                  <Button
                    key={service.id}
                    variant={formData.serviceType === service.id ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, serviceType: service.id })}
                    className="h-12 flex items-center justify-start gap-2 text-left text-sm"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{service.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Job Title */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-1">
              <FileText className="w-3 h-3" />
              Тапсырыс атауы
            </label>
            <Input
              placeholder="Мысалы: Үйлену тойы видеосы"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-9 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium mb-1">Толық сипаттама</label>
            <Textarea
              placeholder="Тапсырыс туралы толық ақпарат жазыңыз..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[80px] text-sm"
            />
          </div>

          {/* Budget and Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-xs font-medium mb-1">
                <DollarSign className="w-3 h-3" />
                Бюджет (₸)
              </label>
              <Input
                placeholder="150,000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-medium mb-1">
                <MapPin className="w-3 h-3" />
                Орын
              </label>
              <Input
                placeholder="Алматы"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="flex items-center gap-1 text-xs font-medium mb-1">
              <Clock className="w-3 h-3" />
              Мерзім
            </label>
            <Select value={formData.deadline} onValueChange={(value) => setFormData({ ...formData, deadline: value })}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Мерзім таңдаңыз" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-week">1 апта</SelectItem>
                <SelectItem value="2-weeks">2 апта</SelectItem>
                <SelectItem value="1-month">1 ай</SelectItem>
                <SelectItem value="flexible">Икемді</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Premium Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="premium"
              checked={formData.isPremium}
              onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked as boolean })}
            />
            <label htmlFor="premium" className="text-xs">
              Таңдаулы жариялау (+5,000 ₸) - Жоғарыда көрсетіледі және көп адамға жетеді
            </label>
          </div>

          {/* Cost Summary */}
          <Card className="bg-muted">
            <CardContent className="p-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Негізгі жариялау:</span>
                  <span>3,000 ₸</span>
                </div>
                {formData.isPremium && (
                  <div className="flex justify-between">
                    <span>Таңдаулы жариялау:</span>
                    <span>5,000 ₸</span>
                  </div>
                )}
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Жалпы:</span>
                  <span>{3000 + (formData.isPremium ? 5000 : 0)} ₸</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button onClick={handleSubmit} className="w-full bg-purple-600 hover:bg-purple-700 h-10 text-sm">
            Төлеп жариялау
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
