import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Ашық маршруттарды анықтау
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
  // Егер маршрут ашық болмаса, аутентификацияны талап ету
  if (!isPublicRoute(req)) {
    auth().protect()
  }
})

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next|favicon.ico|robots.txt|sitemap.xml).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}
