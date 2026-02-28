import express from "express";
const router = express.Router();
import {protect} from "../middleware/auth.js";
import {getBalance,getHistory} from "../controllers/creditController.js";

router.get("/balance", protect, getBalance);
router.get("/history", protect, getHistory);


export default router;