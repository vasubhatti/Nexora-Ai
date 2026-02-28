import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.js";
import checkCredits from "../middleware/checkCredits.js";
import {
    ExplainCode, GenerateCode, DebugCode, ReviewCode,
  RefactorCode, GenerateDocumentation, GenerateUnitTests, ConvertCode,
}from "../controllers/codeController.js"

router.post("/explain", protect, checkCredits("CODE_EXPLANATION"), ExplainCode);
router.post("/generate", protect, checkCredits("CODE_GENERATION"), GenerateCode);
router.post("/debug", protect, checkCredits("CODE_DEBUGGING"), DebugCode);
router.post("/review", protect, checkCredits("CODE_REVIEW"), ReviewCode);
router.post("/refactor", protect, checkCredits("CODE_REFACTORING"), RefactorCode);
router.post("/document", protect, checkCredits("CODE_DOCUMENTATION"), GenerateDocumentation);
router.post("/test", protect, checkCredits("UNIT_TEST_GENERATION"), GenerateUnitTests);
router.post("/convert", protect, checkCredits("CODE_CONVERSION"), ConvertCode);

export default router;