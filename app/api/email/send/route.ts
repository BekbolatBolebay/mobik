import { NextResponse } from "next/server"
import { resend } from "@/lib/resend"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { to, subject, html } = await req.json()

    if (!to || !subject || !html) {
      return new NextResponse("Missing required fields: to, subject, html", { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: "MobFrame <onboarding@resend.dev>", // Өзіңіздің Resend-те расталған доменіңізден жіберуші email-ға өзгертіңіз
      to: [to],
      subject: subject,
      html: html,
    })

    if (error) {
      console.error("[RESEND_EMAIL_ERROR]", error)
      return new NextResponse(`Failed to send email: ${error.message}`, { status: 500 })
    }

    return NextResponse.json({ message: "Email sent successfully", data }, { status: 200 })
  } catch (error) {
    console.error("[EMAIL_SEND_ROUTE_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
