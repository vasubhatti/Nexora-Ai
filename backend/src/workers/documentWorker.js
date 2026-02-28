import { Worker } from "bullmq";
import redis from "../config/redis.js";
import JobResult from "../models/JobResult.js";
import * as documentService from "../services/documentService.js";

const processDocumentJob = async (job) => {
  const { type, file, question } = job.data;

  await JobResult.findOneAndUpdate(
    { jobId: job.id },
    { status: "processing" }
  );

  let result;

  switch (type) {
    case "PDF_EXTRACTION":
      result = await documentService.extractText(file);
      break;
    case "DOCUMENT_SUMMARIZATION":
      result = await documentService.summarizeDocument(file);
      break;
    case "KEY_POINTS_EXTRACTION":
      result = await documentService.extractKeyPoints(file);
      break;
    case "DOCUMENT_QA":
      result = await documentService.answerQuestion(file, question);
      break;
    default:
      throw new Error(`Unknown job type: ${type}`);
  }

  await JobResult.findOneAndUpdate(
    { jobId: job.id },
    { status: "completed", result }
  );

  return result;
};

const documentWorker = new Worker(
  "document-processing",
  processDocumentJob,
  {
    connection: redis,
    concurrency: 3, // documents are heavier, less concurrency
  }
);

documentWorker.on("completed", (job) => {
  console.log(`Document job ${job.id} completed`);
});

documentWorker.on("failed", async (job, error) => {
  console.error(`Document job ${job.id} failed:`, error.message);
  await JobResult.findOneAndUpdate(
    { jobId: job.id },
    { status: "failed", error: error.message }
  );
});

export default documentWorker;