import express from "express";
import { protect } from "../middleware/auth.js";
import { getJobResult } from "../services/queueService.js";
import JobResult from "../models/JobResult.js";

const router = express.Router();

// Poll for job result
router.get("/:jobId", protect, async (req, res, next) => {
  try {
    const job = await getJobResult(req.params.jobId, req.user.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: {
        jobId: job.jobId,
        status: job.status,
        type: job.type,
        result: job.result,
        error: job.error,
        creditsUsed: job.creditsUsed,
        createdAt: job.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all jobs for user
router.get("/", protect, async (req, res, next) => {
  try {
    const jobs = await JobResult.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
});

export default router;