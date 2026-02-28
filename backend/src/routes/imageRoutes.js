import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.js";
import checkCredits from "../middleware/checkCredits.js";
import { GenerateImage,CreateLogo,CreateSocialGraphic } from "../controllers/imageController.js";

router.post("/generate", protect, checkCredits("IMAGE_GENERATION"), GenerateImage);
router.post("/logo", protect, checkCredits("LOGO_CREATION"), CreateLogo);
router.post("/social", protect, checkCredits("SOCIAL_MEDIA_GRAPHIC"), CreateSocialGraphic);

export default router;