import { NextResponse } from "next/server"
import Pusher from "pusher"
import { auth } from "@clerk/nextjs/server"

// Pusher серверінің кілттері осы жерде қолданылады
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { channel, event, data } = await req.json()

    if (!channel || !event || !data) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    await pusher.trigger(channel, event, data)

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("[PUSHER_SEND_MESSAGE_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
