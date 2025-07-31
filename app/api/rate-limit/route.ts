import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { auth } from "@clerk/nextjs/server"

// Қарапайым Rate Limiting мысалы
const MAX_REQUESTS = 5 // 5 сұрау
const WINDOW_SIZE_SECONDS = 60 // 60 секунд ішінде

export async function GET(req: Request) {
  try {
    const { userId } = auth()

    // Пайдаланушы ID-і болмаса, IP мекенжайын пайдалану
    const identifier = userId || req.headers.get("x-forwarded-for") || "anonymous"
    const key = `rate_limit:${identifier}`

    // Redis-тен ағымдағы сұрау санын алу
    const currentRequests = await redis.get<number>(key)

    if (currentRequests === null) {
      // Егер бірінші сұрау болса, 1-ге орнатып, мерзімін қою
      await redis.set(key, 1, { ex: WINDOW_SIZE_SECONDS })
    } else {
      // Егер лимиттен асып кетсе
      if (currentRequests >= MAX_REQUESTS) {
        return new NextResponse("Too Many Requests", { status: 429 })
      }
      // Сұрау санын арттыру
      await redis.incr(key)
    }

    return NextResponse.json({
      message: "Request successful",
      currentRequests: currentRequests !== null ? currentRequests + 1 : 1,
    })
  } catch (error) {
    console.error("[RATE_LIMIT_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
