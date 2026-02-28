import {
    chatWithAI,
    generateContent,
    summarizeText,
    translateText,
    checkGrammar
} from "../services/textService.js";
import Generation from "../models/Generation.js";

const saveGeneration = async (userId, type, prompt, result, creditsUsed, metadata = {}) => {
  await Generation.create({ user: userId, type, prompt, result, creditsUsed, model: "gpt-4o-mini", metadata });
};

// POST /api/text/chat
export const chat = async (req, res, next) => {
  try {
    const { message, conversationHistory } = req.body;
    const result = await chatWithAI(message, conversationHistory || []);
    await saveGeneration(req.user.id, "CHAT", message, result, req.creditCost);
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

// POST /api/text/generate
export const GenerateContent = async (req, res, next) => {
  try {
    const { prompt, tone, length } = req.body;
    const result = await generateContent(prompt, tone, length);
    await saveGeneration(req.user.id, "CONTENT_GENERATION", prompt, result, req.creditCost, { tone, length });
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

// POST /api/text/summarize
export const summarize = async (req, res, next) => {
  try {
    const { text, style } = req.body;
    const result = await summarizeText(text, style);
    await saveGeneration(req.user.id, "SUMMARIZATION", text, result, req.creditCost, { style });
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

// POST /api/text/translate
export const translate = async (req, res, next) => {
  try {
    const { text, targetLanguage } = req.body;
    const result = await translateText(text, targetLanguage);
    await saveGeneration(req.user.id, "TRANSLATION", text, result, req.creditCost, { targetLanguage });
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

// POST /api/text/grammar
export const grammarCheck = async (req, res, next) => {
  try {
    const { text } = req.body;
    const result = await checkGrammar(text);
    await saveGeneration(req.user.id, "GRAMMAR_CHECK", text, JSON.stringify(result), req.creditCost);
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};