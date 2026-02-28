import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.js";
import checkCredits from "../middleware/checkCredits.js";
import { chat, GenerateContent, summarize, translate, grammarCheck } from "../controllers/textController.js";

router.post("/chat", protect, checkCredits("CHAT"), chat);
router.post("/generate", protect, checkCredits("CONTENT_GENERATION"), GenerateContent);
router.post("/summarize", protect, checkCredits("SUMMARIZATION"), summarize);
router.post("/translate", protect, checkCredits("TRANSLATION"), translate);
router.post("/grammar", protect, checkCredits("GRAMMAR_CHECK"), grammarCheck);

export default router;