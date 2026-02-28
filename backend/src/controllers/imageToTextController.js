import Generation from "../models/Generation.js";
import {  
    describeImage,
    extractText,
    detectObjects,
    recognizeHandwriting,
    scanDocument
} from "../services/imageToTextService.js"

const saveGeneration = async (userId, type, prompt, result, creditsUsed, metadata = {}) => {
  await Generation.create({ user: userId, type, prompt, result, creditsUsed, model: "openai", metadata });
};

export const DescribeImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    const result = await describeImage(imageUrl);
    await saveGeneration(req.user.id, "IMAGE_DESCRIPTION", imageUrl, result, req.creditCost);
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

export const ExtractText = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    const result = await extractText(imageUrl);
    await saveGeneration(req.user.id, "OCR", imageUrl, result, req.creditCost);
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

export const DetectObjects = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    const result = await detectObjects(imageUrl);
    await saveGeneration(req.user.id, "OBJECT_DETECTION", imageUrl, JSON.stringify(result), req.creditCost);
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

export const RecognizeHandwriting = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    const result = await recognizeHandwriting(imageUrl);
    await saveGeneration(req.user.id, "HANDWRITING_RECOGNITION", imageUrl, result, req.creditCost);
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

export const ScanDocument = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    const result = await scanDocument(imageUrl);
    await saveGeneration(req.user.id, "DOCUMENT_SCANNING", imageUrl, result, req.creditCost);
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};
