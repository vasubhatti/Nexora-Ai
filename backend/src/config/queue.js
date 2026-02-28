import { Queue } from "bullmq";
import redis from "./redis.js";

// Separate queues for different task types
const textQueue = new Queue("text-processing", { connection: redis });
const codeQueue = new Queue("code-processing", { connection: redis });
const documentQueue = new Queue("document-processing", { connection: redis });

export { textQueue, codeQueue, documentQueue };