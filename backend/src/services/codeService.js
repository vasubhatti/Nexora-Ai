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
  "fixedCode": "corrected code(only this formatted as a code block if possible)",
  "explanation": "what you changed and why"
}`;
//   const systemPrompt = `You are an expert debugger.
// Analyze the code and error, find the bug, return fixed code.
// Return only this : issue, fixed code, and explanation of the fix.`;

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
//   const systemPrompt = `You are a technical documentation expert.
// Generate comprehensive markdown documentation as a text which includes 
// - Overview, function descriptions, parameters, return values, usage examples.
// So generate comprehensive documentation for the given code in markdown format and do not use tables for response.
// Do not defferentiate between code and documentation in the response, just generate documentation in markdown format.`;


const systemPrompt = `Output Format: Strictly use Markdown format. Use Markdown tables strategically where they improve readability (such as for parameters and return values). Output ONLY the documentation itself—do not include introductory conversational filler, and do not regurgitate the raw source code.
Content Structure:
Analyze the provided code and generate documentation following this exact structure:
Overview: A high-level explanation of what the script/module does, its primary purpose, and any core dependencies.
API / Function Definitions: For each distinct function, class, or method, provide:
Description: A clear, concise explanation of the function's behavior.
Parameters: A Markdown table listing each parameter. Include columns for the Parameter Name, Data Type, Required/Optional status, and a Description.
Returns: A clear description of the expected return data type and what the return value represents. (If returning a complex object or dictionary, use a table to map out the keys/values).
Usage Example: A practical code snippet enclosed in Markdown code blocks demonstrating how to execute or call the function.
Tone: Keep the language professional, precise, and highly scannable for developers.`
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
