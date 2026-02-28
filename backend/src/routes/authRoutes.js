import express from "express";
const router = express.Router();
import validate from "../middleware/validate.js";
import {registerRules,loginRules} from "../middleware/validations.js";
import { protect } from "../middleware/auth.js";
import {
    register,
    login,
    refreshToken,
    logout,
    getMe,
    googleCallback
} from "../controllers/authController.js";
import passport from "../config/passport.js";

router.post("/register",registerRules,validate, register);
router.post("/login",loginRules,validate, login);
router.post("/refresh",refreshToken);
router.post("/logout",protect,logout);
router.get("/me",protect,getMe);

// Google OAuth routes
router.get("/google",
    passport.authenticate("google",{scope: ["profile","email"],session:false})
)

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: false }),
    googleCallback
)

export default router;