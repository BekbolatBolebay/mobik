"use client"

import { useState, useEffect } from "react"
import { Search, MoreVertical, Send, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Pusher from "pusher-js"

// Pusher клиентінің кілттері осы жерде қолданылады
const PUSHER_APP_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || ""
const PUSHER_APP_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || ""

const mockChats = [
  {
    id: 1,
    name: "Айдар Қасымов",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Жұмыс туралы сұрағым бар",
    time: "14:30",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Сәуле Нұрланова",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Фотосессия қашан болады?",
    time: "12:15",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: 'ТОО "Креатив"',
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Жоба дайын болды",
    time: "Кеше",
    unread: 1,
    online: false,
  },
]

const mockMessages = [
  { id: 1, sender: "Айдар Қасымов", text: "Сәлем! Жұмыс туралы сұрағым бар.", time: "14:28", isMe: false },
  { id: 2, sender: "Мен", text: "Сәлем! Қандай сұрақ?", time: "14:30", isMe: true },
  { id: 3, sender: "Айдар Қасымов", text: "Үйлену тойына видеограф керек еді.", time: "14:32", isMe: false },
]

export default function MessagesSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeChat, setActiveChat] = useState<any>(null)
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    if (!PUSHER_APP_KEY || !PUSHER_APP_CLUSTER) {
      console.warn("Pusher API keys are not configured. Real-time chat will not work.")
      return
    }

    const pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
    })

    const channel = pusher.subscribe("my-channel")

    channel.bind("my-event", (data: any) => {
      console.log("Received real-time message:", data)
      setMessages((prevMessages) => [...prevMessages, { ...data, id: prevMessages.length + 1 }])
    })

    return () => {
      pusher.unsubscribe("my-channel")
      pusher.disconnect()
    }
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const messageData = {
      sender: "Мен",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    }

    fetch("/api/pusher/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "my-channel", event: "my-event", data: messageData }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Message sent via Pusher:", data)
        setMessages((prevMessages) => [...prevMessages, messageData])
        setNewMessage("")
      })
      .catch((error) => console.error("Failed to send message:", error))
  }

  return (
    <div className="pb-16">
      {activeChat ? (
        <div className="flex flex-col h-[calc(100vh-112px)]">
          <div className="sticky top-0 bg-background border-b p-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setActiveChat(null)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={activeChat.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">{activeChat.name[0]}</AvatarFallback>
            </Avatar>
            <h2 className="font-medium text-sm">{activeChat.name}</h2>
            <Button variant="ghost" size="sm" className="ml-auto">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${
                    msg.isMe ? "bg-purple-600 text-white" : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-right mt-1 opacity-75">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-background border-t p-3 flex items-center gap-2">
            <Input
              placeholder="Хабар жазыңыз..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage()
              }}
              className="flex-1 h-9 text-sm"
            />
            <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700 h-9 px-3">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="sticky top-0 bg-background border-b p-3">
            <h1 className="text-lg font-bold mb-3">Хабарлар</h1>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Хабарларда іздеу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
          </div>

          <div className="divide-y">
            {mockChats.map((chat) => (
              <div key={chat.id} className="p-3 hover:bg-muted cursor-pointer" onClick={() => setActiveChat(chat)}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <Badge className="bg-purple-600 text-white text-xs h-4 px-1.5">{chat.unread}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
