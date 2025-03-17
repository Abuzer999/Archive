import { Redis } from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 5,
  tls: {
    rejectUnauthorized: process.env.NODE_ENV !== "production",
  },
});
