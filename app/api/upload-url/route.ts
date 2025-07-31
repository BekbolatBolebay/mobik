import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { auth } from "@clerk/nextjs/server" // Clerk аутентификациясы CLERK_SECRET_KEY-ді жанама түрде пайдаланады

// Cloudflare R2 кілттері осы жерде қолданылады
const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { filename, contentType } = await req.json()

    if (!filename || !contentType) {
      return new NextResponse("Missing filename or contentType", { status: 400 })
    }

    const key = `uploads/${userId}/${Date.now()}-${filename}`

    const command = new PutObjectCommand({
      Bucket: "mobframe-uploads", // R2 Bucket атауыңызды осында енгізіңіз
      Key: key,
      ContentType: contentType,
    })

    const signedUrl = await getSignedUrl(R2, command, { expiresIn: 3600 })

    return NextResponse.json({ signedUrl, key })
  } catch (error) {
    console.error("[R2_UPLOAD_URL_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
