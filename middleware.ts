import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/materials",
  "/category/(.*)",
  "/api/stripe/checkout",
  "/api/pusher/send-message",
  "/api/email/send",
  "/api/upload-url",
])

export default clerkMiddleware((auth, req) => {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    console.warn("Clerk keys not configured. All routes are public.")
    return
  }

  // Егер маршрут ашық болмаса, аутентификацияны талап ету
  if (!isPublicRoute(req)) {
    return auth().redirectToSignIn()
  }
})