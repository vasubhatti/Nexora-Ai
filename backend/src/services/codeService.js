import { callAIForCode } from "./aiService.js";

export const explainCode = async (code, language = "") => {
  const systemPrompt = `You are an expert software engineer and teacher.
Explain the given code clearly so a beginner can understand it.
Break down what each part does. Mention the language, patterns, and purpose.`;

  return await callAIForCode(systemPrompt, `Language: ${language}\n\nCode:\n${code}`);
};

export const generateCode = async (prompt, language = "javascript") => {
  const systemPrompt = `You are an expert ${language} developer.
Generate clean, efficient, well-commented ${language} code.
Follow best practices. Return code in a code block with a brief explanation.`;

  return await callAIForCode(systemPrompt, prompt);
};

export const debugCode = async (code, errorMessage = "", language = "") => {
  const systemPrompt = `You are an expert debugger.
Analyze the code and error, find the bug, return fixed code.
Return only this JSON:
{
  "issue": "what was wrong",
  "fixedCode": "corrected code",
  "explanation": "what you changed and why"
}`;

  const result = await callAIForCode(
    systemPrompt,
    `Language: ${language}\nError: ${errorMessage}\n\nCode:\n${code}`
  );
  try {
    return JSON.parse(result);
  } catch {
    return { issue: "See below", fixedCode: result, explanation: "" };
  }
};

export const reviewCode = async (code, language = "") => {
  const systemPrompt = `You are a senior software engineer doing a code review.
Analyze for quality, performance, security, and best practices.
Return only this JSON:
{
  "score": 85,
  "summary": "overall summary",
  "issues": [{"severity": "high/medium/low", "description": "issue"}],
  "suggestions": ["suggestion 1"],
  "positives": ["what was done well"]
}`;

  const result = await callAIForCode(
    systemPrompt,
    `Language: ${language}\n\nCode:\n${code}`
  );
  try {
    return JSON.parse(result);
  } catch {
    return { score: 0, summary: result, issues: [], suggestions: [], positives: [] };
  }
};

export const refactorCode = async (code, instructions = "", language = "") => {
  const systemPrompt = `You are an expert at code refactoring.
Refactor the code to be cleaner and more efficient.
${instructions ? `Instructions: ${instructions}` : ""}
Return refactored code in a code block with a summary of changes.`;

  return await callAIForCode(systemPrompt, `Language: ${language}\n\nCode:\n${code}`);
};

export const generateDocumentation = async (code, language = "") => {
  const systemPrompt = `You are a technical documentation expert.
Generate comprehensive markdown documentation including:
- Overview, function descriptions, parameters, return values, usage examples.`;

  return await callAIForCode(systemPrompt, `Language: ${language}\n\nCode:\n${code}`);
};

export const generateUnitTests = async (code, language = "", framework = "") => {
  const systemPrompt = `You are an expert in software testing.
Generate comprehensive unit tests covering happy path, edge cases, and errors.
Framework: ${framework || "appropriate for " + language}.
Return only the test code with comments.`;

  return await callAIForCode(systemPrompt, `Language: ${language}\n\nCode:\n${code}`);
};

export const convertCode = async (code, fromLanguage, toLanguage) => {
  const systemPrompt = `You are an expert polyglot developer.
Convert the ${fromLanguage} code to ${toLanguage}.
Maintain the same logic and functionality. Follow ${toLanguage} best practices.
Return converted code in a code block with any important notes.`;

  return await callAIForCode(systemPrompt, code);
};
