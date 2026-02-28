import { callAI } from "./aiService.js";

export const chatWithAI = async (message, conversationHistory = []) => {
  const systemPrompt = `You are Nexora AI, a helpful and intelligent AI assistant. 
You are knowledgeable, friendly, and provide clear and accurate responses. 
Always be concise but thorough. If you don't know something, say so honestly.`;

  const messages = [
    ...conversationHistory,
    { role: "user", content: message },
  ];

  const response = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openai",
      system: systemPrompt,
      messages,
      private: true,
    }),
  });

  if (!response.ok) throw new AppError("AI chat error", 500);
  const data = await response.json();
  return data.choices[0].message.content;
};

export const generateContent = async (prompt, tone = "professional", length = "medium") => {
  const systemPrompt = `You are an expert content writer. Generate high quality engaging content.
Tone: ${tone}.
Length: ${length === "short" ? "150-200 words" : length === "medium" ? "300-500 words" : "600-900 words"}.
Return only the content, no explanations.`;

  return await callAI(systemPrompt, prompt);
};

export const summarizeText = async (text, style = "paragraph") => {
  const systemPrompt = `You are an expert at summarizing content clearly and concisely.
Summarize the given text in ${style === "bullet" ? "bullet points" : "a short paragraph"}.
Capture the key points. Be concise. Return only the summary.`;

  return await callAI(systemPrompt, text);
};

export const translateText = async (text, targetLanguage) => {
  const systemPrompt = `You are a professional translator.
Translate the given text to ${targetLanguage} accurately.
Preserve the tone and meaning. Return only the translated text.`;

  return await callAI(systemPrompt, text);
};

export const checkGrammar = async (text) => {
  const systemPrompt = `You are an expert grammar checker.
Analyze the given text and return a JSON object with this exact structure:
{
  "correctedText": "the fixed text here",
  "errors": ["error 1", "error 2"],
  "improvements": ["improvement 1", "improvement 2"]
}
Return only the JSON, nothing else.`;

  const result = await callAI(systemPrompt, text);
  try {
    return JSON.parse(result);
  } catch {
    return { correctedText: result, errors: [], improvements: [] };
  }
};
