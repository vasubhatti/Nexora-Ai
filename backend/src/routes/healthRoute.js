import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {

  res.json({
    success: true,
    message: "Nexora AI API is running",
    environment: process.env.NODE_ENV,
    services: {
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;