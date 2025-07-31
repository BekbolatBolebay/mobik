import { Redis } from "@upstash/redis"

// Upstash Redis кілттері осы жерде қолданылады
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Мысал: Redis-ке деректерді сақтау
// export async function setCache(key: string, value: any, ex?: number) {
//   await redis.set(key, JSON.stringify(value), { ex });
// }

// Мысал: Redis-тен деректерді алу
// export async function getCache(key: string) {
//   const data = await redis.get(key);
//   return data ? JSON.parse(data as string) : null;
// }
