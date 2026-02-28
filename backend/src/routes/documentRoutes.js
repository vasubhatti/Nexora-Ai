import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.js";
import checkCredits from "../middleware/checkCredits.js";
import upload from "../config/multer.js";
import {
    ExtractText,
    SummarizeDocument,
    ExtractKeyPoints,
    QuestionAnswer
} from "../controllers/documentController.js";

router.post("/extract", protect, checkCredits("PDF_EXTRACTION"), upload.single("document"), ExtractText);
router.post("/summarize", protect, checkCredits("DOCUMENT_SUMMARIZATION"), upload.single("document"), SummarizeDocument);
router.post("/keypoints", protect, checkCredits("KEY_POINTS_EXTRACTION"), upload.single("document"), ExtractKeyPoints);
router.post("/qa", protect, checkCredits("DOCUMENT_QA"), upload.single("document"), QuestionAnswer);

export default router;