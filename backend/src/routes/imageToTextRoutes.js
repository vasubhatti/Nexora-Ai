import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.js";
import checkCredits from "../middleware/checkCredits.js";
import { 
    DescribeImage,
    ExtractText,
    DetectObjects,
    RecognizeHandwriting,
    ScanDocument
 } from "../controllers/imageToTextController.js";

router.post("/describe", protect, checkCredits("IMAGE_DESCRIPTION"), DescribeImage);
router.post("/ocr", protect, checkCredits("OCR"), ExtractText);
router.post("/detect", protect, checkCredits("OBJECT_DETECTION"), DetectObjects);
router.post("/handwriting", protect, checkCredits("HANDWRITING_RECOGNITION"), RecognizeHandwriting);
router.post("/scan", protect, checkCredits("DOCUMENT_SCANNING"), ScanDocument);

export default router;