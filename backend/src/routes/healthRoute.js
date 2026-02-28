import express from "express";
import mongoose from "mongoose";
import redis from "../config/redis.js";

const router = express.Router();

router.get("/", async (req, res) => {
  // Check Redis connection
  let redisStatus = "disconnected";
  try {
    await redis.ping();
    redisStatus = "connected";
  } catch {
    redisStatus = "disconnected";
  }

  res.json({
    success: true,
    message: "Nexora AI API is running",
    environment: process.env.NODE_ENV,
    services: {
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      redis: redisStatus,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;