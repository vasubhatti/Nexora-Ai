import Generation from "../models/Generation.js";
import {  
    generateImage,
    createLogo,
    createSocialMediaGraphic
} from "../services/imageService.js"

const saveGeneration = async (userId, type, prompt, resultUrl, creditsUsed, metadata = {}) => {
  await Generation.create({
    user: userId,
    type,
    prompt,
    result: resultUrl, // store URL as result
    resultUrl,
    creditsUsed,
    model: "flux",
    metadata,
  });
};

// POST /api/image/generate
export const GenerateImage = async (req, res, next) => {
  try {
    const { prompt, width, height } = req.body;
    const imageUrl = await generateImage(prompt, { width, height });

    await saveGeneration(req.user.id, "IMAGE_GENERATION", prompt, imageUrl, req.creditCost);

    res.json({
      success: true,
      data: {
        imageUrl,
        prompt,
        creditsUsed: req.creditCost,
        remainingCredits: req.remainingCredits,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/image/logo
export const CreateLogo = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const imageUrl = await createLogo(prompt);

    await saveGeneration(req.user.id, "LOGO_CREATION", prompt, imageUrl, req.creditCost);

    res.json({
      success: true,
      data: {
        imageUrl,
        prompt,
        creditsUsed: req.creditCost,
        remainingCredits: req.remainingCredits,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/image/social
export const CreateSocialGraphic = async (req, res, next) => {
  try {
    const { prompt, platform } = req.body;
    const imageUrl = await createSocialMediaGraphic(prompt, platform);

    await saveGeneration(req.user.id, "SOCIAL_MEDIA_GRAPHIC", prompt, imageUrl, req.creditCost, { platform });

    res.json({
      success: true,
      data: {
        imageUrl,
        platform,
        prompt,
        creditsUsed: req.creditCost,
        remainingCredits: req.remainingCredits,
      },
    });
  } catch (error) {
    next(error);
  }
};