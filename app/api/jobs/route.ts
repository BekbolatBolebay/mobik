import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { auth } from "@clerk/nextjs/server" // Clerk аутентификациясы CLERK_SECRET_KEY-ді жанама түрде пайдаланады

export async function POST(req: Request) {
  try {
    const { userId } = auth() // Clerk арқылы пайдаланушы ID-ін алу

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, description, serviceType, budget, location, deadline, isPremium } = await req.json()

    if (!title || !description || !serviceType || !budget || !location || !deadline) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const result = await sql`
      INSERT INTO jobs (user_id, title, description, service_type, budget, location, deadline, is_premium)
      VALUES (${userId}, ${title}, ${description}, ${serviceType}, ${budget}, ${location}, ${deadline}, ${isPremium})
      RETURNING id;
    `

    return NextResponse.json({ message: "Job posted successfully", jobId: result[0].id }, { status: 201 })
  } catch (error) {
    console.error("[JOBS_POST_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const jobs = await sql`SELECT * FROM jobs ORDER BY created_at DESC;`
    return NextResponse.json(jobs)
  } catch (error) {
    console.error("[JOBS_GET_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
