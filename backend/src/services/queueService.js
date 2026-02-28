import { textQueue, documentQueue } from "../config/queue.js";
import JobResult from "../models/JobResult.js";

const addTextJob = async (userId, type, data, creditsUsed) => {
  // Add job to queue
  const job = await textQueue.add(type, { type, data, userId });

  // Create job result record immediately
  await JobResult.create({
    user: userId,
    jobId: job.id,
    queueName: "text-processing",
    status: "pending",
    type,
    input: data,
    creditsUsed,
  });

  return job.id;
};

const addDocumentJob = async (userId, type, fileData, question, creditsUsed) => {
  const job = await documentQueue.add(type, {
    type,
    file: fileData,
    question,
    userId,
  });

  await JobResult.create({
    user: userId,
    jobId: job.id,
    queueName: "document-processing",
    status: "pending",
    type,
    input: { question },
    creditsUsed,
  });

  return job.id;
};

const getJobResult = async (jobId, userId) => {
  const jobResult = await JobResult.findOne({
    jobId,
    user: userId,
  });

  if (!jobResult) return null;
  return jobResult;
};

export { addTextJob, addDocumentJob, getJobResult };