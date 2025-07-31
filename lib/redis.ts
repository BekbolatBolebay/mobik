import { Redis } from "@upstash/redis"

// Upstash Redis клиентін инициализациялау
// Бұл тек серверде қолданылуы керек, себебі құпия кілттер бар
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})
