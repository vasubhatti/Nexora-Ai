import mammoth from "mammoth";
import { callAI } from "./aiService.js";
import AppError from "../utils/AppError.js";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const extractTextFromFile = async (file) => {
  const { mimetype, buffer } = file;

  try {
    if (mimetype === "application/pdf") {
      const uint8Array = new Uint8Array(buffer);
      const pdf = await getDocument({ data: uint8Array }).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
      }

      return text;
    }

    if (
      mimetype === "application/msword" ||
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    if (mimetype === "text/plain") {
      return buffer.toString("utf-8");
    }

    throw new AppError("Unsupported file type.", 400);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to extract text from file: " + error.message, 500);
  }
};

const truncateText = (text, maxLength = 8000) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "\n\n[Document truncated due to length...]";
};

export const extractText = async (file) => {
  const text = await extractTextFromFile(file);
  if (!text || text.trim().length === 0) {
    throw new AppError("No text could be extracted from this document.", 400);
  }
  return text;
};

export const summarizeDocument = async (file) => {
  const text = await extractTextFromFile(file);
  const truncated = truncateText(text);

  const systemPrompt = `You are an expert document summarizer.
Provide a comprehensive summary of the document including:
- Main topic and purpose
- Key findings or arguments
- Important conclusions
- Any critical data or statistics mentioned
Format in clear paragraphs. Be thorough but concise.`;

  return await callAI(systemPrompt, truncated);
};

export const extractKeyPoints = async (file) => {
  const text = await extractTextFromFile(file);
  const truncated = truncateText(text);

  const systemPrompt = `You are an expert at analyzing documents.
Extract the most important key points from this document.
Return a JSON object with this structure:
{
  "title": "document title or topic",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "mainTheme": "the central theme",
  "importantFacts": ["fact 1", "fact 2"],
  "conclusion": "main conclusion or takeaway"
}
Return only the JSON.`;

  const result = await callAI(systemPrompt, truncated);
  try {
    return JSON.parse(result);
  } catch {
    return { keyPoints: [result], mainTheme: "", importantFacts: [], conclusion: "" };
  }
};

export const answerQuestion = async (file, question) => {
  const text = await extractTextFromFile(file);
  const truncated = truncateText(text);

  const systemPrompt = `You are an expert document analyst.
Answer the user's question based ONLY on the content of the provided document.
If the answer is not found in the document, say "This information is not available in the document."
Be specific and reference relevant parts of the document in your answer.`;

  const userPrompt = `Document Content:\n${truncated}\n\nQuestion: ${question}`;
  return await callAI(systemPrompt, userPrompt);
};