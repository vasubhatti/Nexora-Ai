import AppError from "../utils/AppError.js";

const POLLINATIONS_URL = "https://text.pollinations.ai/openai";

const analyzeImage = async (imageUrl, systemPrompt)=> {
    try {
        const response = await fetch(POLLINATIONS_URL,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.POLLINATIONS_TOKEN}`,
            },
            body: JSON.stringify({
            model: "openai",
            messages: [
            {
                role: "user",
                content: [
                { type: "text", text: systemPrompt },
                { type: "image_url", image_url: { url: imageUrl } },
                ],
            },
            ],
            private: true,
        }),
        });

        if (!response.ok) throw new AppError("Image analysis failed.", 500);

        const data = await response.json();
        const message = data.choices[0].message;
        return message.content || message.reasoning_content;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Image to text error: " + error.message, 500);
    }
}

export const describeImage = async (imageUrl) => {
  const systemPrompt = `Describe this image in detail. Include objects, people, colors, setting, mood, and any text visible. Be thorough and descriptive.`;
  return await analyzeImage(imageUrl, systemPrompt);
};

export const extractText = async (imageUrl) => {
  const systemPrompt = `Extract ALL text visible in this image exactly as it appears. Preserve formatting where possible. If no text is found, say "No text found in image".`;
  return await analyzeImage(imageUrl, systemPrompt);
};

export const detectObjects = async (imageUrl) => {
  const systemPrompt = `Detect and list all objects visible in this image. For each object provide:
- Object name
- Location in image (top-left, center, etc)
- Approximate size (small, medium, large)
Return as a JSON array: [{"object": "name", "location": "position", "size": "size"}]`;

  const result = await analyzeImage(imageUrl, systemPrompt);
  try {
    return JSON.parse(result);
  } catch {
    return result;
  }
};

export const recognizeHandwriting = async (imageUrl) => {
  const systemPrompt = `This image contains handwritten text. Transcribe ALL handwritten content exactly as written. Preserve line breaks. If unclear, make your best guess and mark with [unclear].`;
  return await analyzeImage(imageUrl, systemPrompt);
};

export const scanDocument = async (imageUrl) => {
    const systemPrompt = `This is a scanned document. Extract and structure all content including:
    - Headings and subheadings
    - Body text
    - Tables (format as markdown)
    - Lists
    - Any other structured content
    Preserve the document structure as much as possible.`;
    return await analyzeImage(imageUrl, systemPrompt);
};
