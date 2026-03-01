import express from "express";
import connectDB from "./config/database.js";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import helmet from "helmet";
// import morgan from "morgan";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 5000;

import "./workers/textWorker.js"
import "./workers/documentWorker.js"

import healthRoute from "./routes/healthRoute.js";
import authRoutes from "./routes/authRoutes.js";
import creditRoutes from "./routes/creditRoutes.js";
import textRoutes from "./routes/textRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import generationRoutes from "./routes/generationRoutes.js";
import imageRoutes from "./routes/imageRoutes.js"
import imageToTextRoutes from "./routes/imageToTextRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import jobRoutes from "./routes/jobRoutes.js"

import errorHandler from "./middleware/errorHandler.js";
import { generalLimiter, authLimiter, aiLimiter } from "./middleware/rateLimiter.js";
import passport from "./config/passport.js"
import dotenv from 'dotenv';    
dotenv.config();
connectDB();


// Prevent HTTP parameter pollution
app.use(hpp());

// Increase security with helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors({origin: process.env.CLIENT_URL,credentials: true}));
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb", extended: true}));
app.use(passport.initialize());

app.use(generalLimiter);

// Routes
app.use("/api/health", healthRoute);
app.use("/api/auth",authLimiter,authRoutes);
app.use("/api/credits",creditRoutes);
app.use("/api/text",aiLimiter,textRoutes);
app.use("/api/code",aiLimiter,codeRoutes);
app.use("/api/generations",generationRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/image-to-text", imageToTextRoutes);
app.use("/api/document", aiLimiter,documentRoutes);
app.use("/api/jobs", jobRoutes);

// 404 Handler
app.use((req,res,next)=>{
    res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
})

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});