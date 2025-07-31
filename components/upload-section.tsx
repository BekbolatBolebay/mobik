"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Video, Upload, Hash, Type, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const categories = ["Музыка", "LUT пресеттер", "Видео", "Фото", "Дыбыс эффектілері", "Анимация"]

export default function UploadSection() {
  const [uploadType, setUploadType] = useState<"photo" | "video">("photo")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [hashtags, setHashtags] = useState("")
  const [category, setCategory] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Файл таңдаңыз!")
      return
    }

    try {
      // 1. Серверден алдын ала қол қойылған URL алу
      const response = await fetch("/api/upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: selectedFile.name,
          contentType: selectedFile.type,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get signed URL")
      }

      const { signedUrl, key } = await response.json()

      // 2. Файлды тікелей Cloudflare R2-ге жүктеу
      await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      })

      alert("Файл сәтті жүктелді!")
      console.log("Uploaded to R2:", key)

      // Жүктеу сәтті болғаннан кейін форманы тазалау
      setTitle("")
      setDescription("")
      setHashtags("")
      setCategory("")
      setSelectedFile(null)
    } catch (error) {
      console.error("Файлды жүктеу қатесі:", error)
      alert("Файлды жүктеу кезінде қате пайда болды. Қайталап көріңіз.")
    }
  }

  return (
    <div className="p-3 pb-16">
      <h1 className="text-lg font-bold mb-4">Жариялау</h1>

      <Card className="bg-card mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Контент түрін таңдаңыз</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={uploadType === "photo" ? "default" : "outline"}
              onClick={() => setUploadType("photo")}
              className="h-16 flex flex-col items-center gap-1 text-sm"
            >
              <Camera className="w-6 h-6" />
              <span>Фото</span>
            </Button>
            <Button
              variant={uploadType === "video" ? "default" : "outline"}
              onClick={() => setUploadType("video")}
              className="h-16 flex flex-col items-center gap-1 text-sm"
            >
              <Video className="w-6 h-6" />
              <span>Видео</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="bg-card mb-4">
        <CardContent className="p-4">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-2 text-sm">
              {uploadType === "photo" ? "Фото жүктеу" : "Видео жүктеу"}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Максимум: {uploadType === "photo" ? "200MB" : "8K видеоларға дейін"}
            </p>
            <label
              htmlFor="file-upload"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 cursor-pointer"
            >
              Файл таңдау
            </label>
            <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
            {selectedFile && <p className="mt-2 text-sm text-muted-foreground">{selectedFile.name}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Content Details */}
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Контент ақпараты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-1">
              <Type className="w-3 h-3" />
              Атауы
            </label>
            <Input
              placeholder="Контент атауын жазыңыз..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-1">
              <FileText className="w-3 h-3" />
              Сипаттама
            </label>
            <Textarea
              placeholder="Контент туралы сипаттама..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Категория</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Категория таңдаңыз" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-1">
              <Hash className="w-3 h-3" />
              Хэштегтер
            </label>
            <Input
              placeholder="#фото #алматы #портрет"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <Button onClick={handleUpload} className="w-full bg-purple-600 hover:bg-purple-700 h-10 text-sm">
            Жариялау
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
