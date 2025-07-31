"use client"

import { useState } from "react"
import { MapPin, Clock, DollarSign, Star, Send, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface JobsSectionProps {
  onCreateJob: () => void
}

const mockJobs = [
  {
    id: 1,
    title: "Үйлену тойы видеосы",
    client: "Айгүл Сәрсенова",
    avatar: "/placeholder.svg?height=32&width=32",
    location: "Алматы",
    budget: "150,000 ₸",
    deadline: "2 апта",
    description: "Үйлену тойының толық видеосын түсіру керек. 8 сағат жұмыс.",
    category: "Видео",
    isPremium: true,
    rating: 4.8,
    responses: 12,
  },
  {
    id: 2,
    title: "Өнім фотосессиясы",
    client: 'ТОО "Стиль"',
    avatar: "/placeholder.svg?height=32&width=32",
    location: "Нұр-Сұлтан",
    budget: "80,000 ₸",
    deadline: "1 апта",
    description: "Киім коллекциясының фотосессиясы. Студияда жұмыс.",
    category: "Фото",
    isPremium: false,
    rating: 4.5,
    responses: 8,
  },
]

export default function JobsSection({ onCreateJob }: JobsSectionProps) {
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [proposal, setProposal] = useState("")

  const handleConnect = (job: any) => {
    // Instead of sending proposal, create connection
    console.log("Creating connection with:", job.client)
    alert(`${job.client} клиентімен байланыс орнатылды!`)
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Белсенді жұмыстар</h2>
        <Button size="sm" onClick={onCreateJob} className="bg-purple-600 hover:bg-purple-700 h-8 px-3 text-xs">
          <Plus className="w-3 h-3 mr-1" />
          Жариялау
        </Button>
      </div>

      <div className="space-y-2">
        {mockJobs.map((job) => (
          <Card key={job.id} className="bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={job.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{job.client[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm">{job.title}</CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{job.client}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{job.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {job.isPremium && <Badge className="bg-yellow-600 text-black text-xs">Таңдаулы</Badge>}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{job.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span>{job.deadline}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-muted-foreground" />
                  <span>{job.budget}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Send className="w-3 h-3 text-muted-foreground" />
                  <span>{job.responses} байланыс</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {job.category}
                </Badge>

                <Button
                  size="sm"
                  onClick={() => handleConnect(job)}
                  className="bg-purple-600 hover:bg-purple-700 h-7 px-3 text-xs"
                >
                  Байланысу
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
