import { NextResponse } from "next/server"
import { sendOneSignalNotification } from "@/lib/onesignal"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, message, targetUserId } = await req.json() // targetUserId - OneSignal-дағы пайдаланушы ID-і

    if (!title || !message || !targetUserId) {
      return new NextResponse("Missing required fields: title, message, targetUserId", { status: 400 })
    }

    const notificationOptions = {
      app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!, // NEXT_PUBLIC_ONESIGNAL_APP_ID қажет
      contents: { en: message, kk: message }, // Ағылшын және қазақ тілдеріндегі мазмұн
      include_external_user_ids: [targetUserId], // Белгілі бір пайдаланушыға жіберу
      headings: { en: title, kk: title },
      // url: "https://mobframe.kz/messages", // Хабарламаны басқанда ашылатын URL
    }

    const result = await sendOneSignalNotification(notificationOptions)

    return NextResponse.json({ message: "Notification sent successfully", result }, { status: 200 })
  } catch (error) {
    console.error("[ONESIGNAL_SEND_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
