import AppError from "../utils/AppError.js";

const POLLINATIONS_URL = "https://gen.pollinations.ai/v1/chat/completions";

const getPollinationsHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };

  const token = process.env.POLLINATIONS_TOKEN || process.env.POLLINATIONS_API_KEY;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const callAI = async (systemPrompt, userPrompt, options = {}) => {
  try {
     const messages = options.messages || [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];
    const response = await fetch(POLLINATIONS_URL, {
      method: "POST",
      headers: getPollinationsHeaders(),
      body: JSON.stringify({
        model: options.model || "openai",
         messages,
        max_tokens: options.maxTokens || 3000,
        temperature: options.temperature || 0.7,
        private: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new AppError(
        `Pollinations API error: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ""}`,
        500
      );
    }
     const data = await response.json();

    const message = data.choices?.[0]?.message;

    // Sometimes content is empty, fallback to reasoning_content
    const result = message?.content || message?.reasoning_content;

    if (!result) {
      throw new AppError("AI returned empty response. Try again.", 500);
    }

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("AI service error: " + error.message, 500);
  }
};

// Use openai model for text, qwen-coder for code
export const callAIForCode = async (systemPrompt, userPrompt, options = {}) => {
  return callAI(systemPrompt, userPrompt, { ...options, model: options.model || "qwen-coder" });
};

export const callOpenAI = callAI;
export const callClaude = callAI;

