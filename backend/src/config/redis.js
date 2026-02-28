import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, // required for BullMQ
  tls: {}, // required for Upstash (uses SSL)
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;