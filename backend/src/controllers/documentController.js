import Generation from "../models/Generation.js";
import {
    extractText,
    summarizeDocument,
    extractKeyPoints,
    answerQuestion
} from "../services/documentService.js"

const saveGeneration = async (userId, type, prompt, result, creditsUsed, metadata = {}) => {
  await Generation.create({
    user: userId,
    type,
    prompt,
    result,
    creditsUsed,
    model: "openai",
    metadata,
  });
};

// POST /api/document/extract
export const ExtractText = async (req, res, next) => {
  try {
    const result = await extractText(req.file);
    await saveGeneration(
      req.user.id, "PDF_EXTRACTION",
      req.file.originalname, result,
      req.creditCost,
      { filename: req.file.originalname, size: req.file.size }
    );

    res.json({
      success: true,
      data: {
        result,
        filename: req.file.originalname,
        creditsUsed: req.creditCost,
        remainingCredits: req.remainingCredits,
      },
    });
  } catch (error) { next(error); }
};

// POST /api/document/summarize
export const SummarizeDocument = async (req, res, next) => {
  try {
    const result = await summarizeDocument(req.file);
    await saveGeneration(
      req.user.id, "DOCUMENT_SUMMARIZATION",
      req.file.originalname, result,
      req.creditCost,
      { filename: req.file.originalname }
    );

    res.json({
      success: true,
      data: {
        result,
        filename: req.file.originalname,
        creditsUsed: req.creditCost,
        remainingCredits: req.remainingCredits,
      },
    });
  } catch (error) { next(error); }
};

// POST /api/document/keypoints
export const ExtractKeyPoints = async (req, res, next) => {
  try {
    const result = await extractKeyPoints(req.file);
    await saveGeneration(
      req.user.id, "KEY_POINTS_EXTRACTION",
      req.file.originalname, JSON.stringify(result),
      req.creditCost,
      { filename: req.file.originalname }
    );

    res.json({
      success: true,
      data: {
        result,
        filename: req.file.originalname,
        creditsUsed: req.creditCost,
        remainingCredits: req.remainingCredits,
      },
    });
  } catch (error) { next(error); }
};

// POST /api/document/qa
export const QuestionAnswer = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: "Question is required." });
    }

    const result = await answerQuestion(req.file, question);
    await saveGeneration(
      req.user.id, "DOCUMENT_QA",
      question, result,
      req.creditCost,
      { filename: req.file.originalname, question }
    );

    res.json({
      success: true,
      data: {
        question,
        result,
        filename: req.file.originalname,
        creditsUsed: req.creditCost,
        remainingCredits: req.remainingCredits,
      },
    });
  } catch (error) { next(error); }
};