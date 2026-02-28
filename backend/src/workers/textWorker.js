import { Worker } from "bullmq";
import redis from "../config/redis.js";
import JobResult from "../models/JobResult.js";
import * as textService from "../services/textService.js";
import * as codeService from "../services/codeService.js";

const processTextJob = async (job) => {
  const { type, data, userId } = job.data;

  // Update status to processing
  await JobResult.findOneAndUpdate(
    { jobId: job.id },
    { status: "processing" }
  );

  let result;

  // Route to correct service based on type
  switch (type) {
    case "CHAT":
      result = await textService.chatWithAI(data.message, data.conversationHistory || []);
      break;
    case "CONTENT_GENERATION":
      result = await textService.generateContent(data.prompt, data.tone, data.length);
      break;
    case "SUMMARIZATION":
      result = await textService.summarizeText(data.text, data.style);
      break;
    case "TRANSLATION":
      result = await textService.translateText(data.text, data.targetLanguage);
      break;
    case "GRAMMAR_CHECK":
      result = await textService.checkGrammar(data.text);
      break;
    case "CODE_GENERATION":
      result = await codeService.generateCode(data.prompt, data.language);
      break;
    case "CODE_DEBUGGING":
      result = await codeService.debugCode(data.code, data.errorMessage, data.language);
      break;
    case "CODE_REVIEW":
      result = await codeService.reviewCode(data.code, data.language);
      break;
    case "CODE_REFACTORING":
      result = await codeService.refactorCode(data.code, data.instructions, data.language);
      break;
    case "CODE_DOCUMENTATION":
      result = await codeService.generateDocumentation(data.code, data.language);
      break;
    case "UNIT_TEST_GENERATION":
      result = await codeService.generateUnitTests(data.code, data.language, data.framework);
      break;
    case "CODE_CONVERSION":
      result = await codeService.convertCode(data.code, data.fromLanguage, data.toLanguage);
      break;
    default:
      throw new Error(`Unknown job type: ${type}`);
  }

  // Save completed result
  await JobResult.findOneAndUpdate(
    { jobId: job.id },
    { status: "completed", result }
  );

  return result;
};

// Create worker
const textWorker = new Worker(
  "text-processing",
  processTextJob,
  {
    connection: redis,
    concurrency: 5, // process 5 jobs at once
  }
);

textWorker.on("completed", (job) => {
  console.log(`Text job ${job.id} completed`);
});

textWorker.on("failed", async (job, error) => {
  console.error(`Text job ${job.id} failed:`, error.message);
  await JobResult.findOneAndUpdate(
    { jobId: job.id },
    { status: "failed", error: error.message }
  );
});

export default textWorker;