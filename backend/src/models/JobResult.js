import mongoose from "mongoose";

const jobResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: String,
      required: true,
      unique: true,
    },
    queueName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    type: {
      type: String,
      required: true,
    },
    input: {
      type: mongoose.Schema.Types.Mixed, // store original request data
    },
    result: {
      type: mongoose.Schema.Types.Mixed, // store AI result
    },
    error: {
      type: String,
    },
    creditsUsed: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobResult", jobResultSchema);