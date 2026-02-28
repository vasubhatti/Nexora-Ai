import AppError from "../utils/AppError.js";

const POLLINATIONS_IMAGE_URL = "https://image.pollinations-ai.com/prompt";

const buildImageUrl = (prompt, options = {}) => {
  const encodedPrompt = encodeURIComponent(prompt);
  const params = new URLSearchParams({
    width: options.width || 1024,
    height: options.height || 1024,
    model: options.model || "flux",
    seed: Math.floor(Math.random() * 99999),
    nologo: true,
    private: true,
  });

  // Add token only if it exists
  if (process.env.POLLINATIONS_TOKEN) {
    params.append("token", process.env.POLLINATIONS_TOKEN);
  }

  return `${POLLINATIONS_IMAGE_URL}/${encodedPrompt}?${params.toString()}`;
};

export const generateImage = async (prompt, options = {}) => {
  const enhancedPrompt = `${prompt}, high quality, detailed, professional`;
  return buildImageUrl(enhancedPrompt, { width: 1024, height: 1024, ...options });
};

export const createLogo = async (prompt) => {
  const enhancedPrompt = `professional logo design for ${prompt}, minimalist, vector style, clean`;
  return buildImageUrl(enhancedPrompt, { width: 512, height: 512 });
};

export const createSocialMediaGraphic = async (prompt, platform = "instagram") => {
  const platformSizes = {
    instagram: { width: 1080, height: 1080 },
    twitter: { width: 1200, height: 675 },
    facebook: { width: 1200, height: 630 },
    linkedin: { width: 1200, height: 627 },
    youtube: { width: 1280, height: 720 },
  };

  const size = platformSizes[platform] || platformSizes.instagram;
  const enhancedPrompt = `social media graphic for ${platform}, ${prompt}, eye-catching, professional`;
  return buildImageUrl(enhancedPrompt, size);
};
