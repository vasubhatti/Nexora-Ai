import {
    explainCode,
    generateCode,
    debugCode,
    reviewCode,
    refactorCode,
    generateDocumentation,
    generateUnitTests,
    convertCode
}from "../services/codeService.js";
import Generation from "../models/Generation.js";

const saveGeneration = async (userId, type, prompt, result, creditsUsed, metadata = {}) => {
  await Generation.create({ user: userId, type, prompt, result, creditsUsed, model: "gpt-4o-mini", metadata });
};

export const ExplainCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const result = await explainCode(code, language);
    await saveGeneration(req.user.id, "CODE_EXPLANATION", code, result, req.creditCost, { language });
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

export const GenerateCode = async (req, res, next) => {
  try {
    const { prompt, language } = req.body;
    const result = await generateCode(prompt, language);
    await saveGeneration(req.user.id, "CODE_GENERATION", prompt, result, req.creditCost, { language });
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

export const DebugCode = async (req, res, next) => {
  try {
    const { code, errorMessage, language } = req.body;
    const result = await debugCode(code, errorMessage, language);
    await saveGeneration(req.user.id, "CODE_DEBUGGING", code, JSON.stringify(result), req.creditCost, { language });
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

export const ReviewCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const result = await reviewCode(code, language);
    await saveGeneration(req.user.id, "CODE_REVIEW", code, JSON.stringify(result), req.creditCost, { language });
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

export const RefactorCode = async (req, res, next) => {
  try {
    const { code, instructions, language } = req.body;
    const result = await refactorCode(code, instructions, language);
    await saveGeneration(req.user.id, "CODE_REFACTORING", code, result, req.creditCost, { language });
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

export const GenerateDocumentation = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const result = await generateDocumentation(code, language);
    await saveGeneration(req.user.id, "CODE_DOCUMENTATION", code, result, req.creditCost, { language });
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

export const GenerateUnitTests = async (req, res, next) => {
  try {
    const { code, language, framework } = req.body;
    const result = await generateUnitTests(code, language, framework);
    await saveGeneration(req.user.id, "UNIT_TEST_GENERATION", code, result, req.creditCost, { language, framework });
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};

export const ConvertCode = async (req, res, next) => {
  try {
    const { code, fromLanguage, toLanguage } = req.body;
    const result = await convertCode(code, fromLanguage, toLanguage);
    await saveGeneration(req.user.id, "CODE_CONVERSION", code, result, req.creditCost, { fromLanguage, toLanguage });
    res.json({ success: true, data: { result, creditsUsed: req.creditCost, remainingCredits: req.remainingCredits } });
  } catch (error) { next(error); }
};