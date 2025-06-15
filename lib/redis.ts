// import { Redis } from "ioredis";

// export const redis = new Redis(process.env.REDIS_URL!, {
//   tls: {
//     rejectUnauthorized: false,
//   },
//   maxRetriesPerRequest: 10,
//   connectTimeout: 30000,
//   reconnectOnError: (err) => {
//     console.error("🔁 Redis reconnect on error:", err);
//     return true;
//   },
// });

// redis.on("error", (err) => {
//   console.error("❌ Redis connection error:", err);
// });


import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})