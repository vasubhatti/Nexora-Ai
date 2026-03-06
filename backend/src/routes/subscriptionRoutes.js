import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
import { addCredits } from "../services/creditService.js";

const router = express.Router();

const PLANS = {
  free: { credits: 100, label: "Free" },
  pro: { credits: 1000, label: "Pro" },
  enterprise: { credits: 10000, label: "Enterprise" },
};

const PROMO_CODES = {
  "NEXORA100": { credits: 100, description: "100 bonus credits" },
  "NEXORA500": { credits: 500, description: "500 bonus credits" },
  "WELCOME200": { credits: 200, description: "Welcome bonus 200 credits" },
  "DEVTEST999": { credits: 999, description: "Developer test credits" },
  "LAUNCH50":  { credits: 50,  description: "Launch special 50 credits" },
};

// Track redeemed codes per user in memory
const redeemedCodes = new Map();

// GET /api/subscription/plans
router.get("/plans", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: "free",
        label: "Free",
        credits: 100,
        price: "$0/month",
        features: [
          "100 credits/month",
          "All AI tools",
          "Generation history",
          "Basic support",
        ],
      },
      {
        id: "pro",
        label: "Pro",
        credits: 1000,
        price: "$9/month",
        features: [
          "1000 credits/month",
          "All AI tools",
          "Generation history",
          "Priority support",
          "Faster responses",
        ],
      },
      {
        id: "enterprise",
        label: "Enterprise",
        credits: 10000,
        price: "$29/month",
        features: [
          "10000 credits/month",
          "All AI tools",
          "Generation history",
          "Dedicated support",
          "Fastest responses",
          "API access",
        ],
      },
    ],
  });
});

// POST /api/subscription/upgrade
router.post("/upgrade", protect, async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan.",
      });
    }

    if (req.user.subscription === plan) {
      return res.status(400).json({
        success: false,
        message: `You are already on the ${plan} plan.`,
      });
    }

    const user = await User.findById(req.user.id);
    const oldPlan = user.subscription;

    user.subscription = plan;
    user.creditBalance = PLANS[plan].credits;
    user.creditsUsed = 0;
    user.creditsResetDate = new Date(
      new Date().setMonth(new Date().getMonth() + 1)
    );
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: `Successfully upgraded to ${PLANS[plan].label} plan.`,
      data: {
        subscription: user.subscription,
        creditBalance: user.creditBalance,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/subscription/redeem
router.post("/redeem", protect, async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Promo code is required.",
      });
    }

    const upperCode = code.toUpperCase().trim();
    const promo = PROMO_CODES[upperCode];

    if (!promo) {
      return res.status(400).json({
        success: false,
        message: "Invalid promo code.",
      });
    }

    const userRedeemed = redeemedCodes.get(req.user.id.toString()) || [];
    if (userRedeemed.includes(upperCode)) {
      return res.status(400).json({
        success: false,
        message: "You have already redeemed this code.",
      });
    }

    const newBalance = await addCredits(
      req.user.id,
      promo.credits,
      `Promo code redeemed: ${upperCode}`,
      "bonus"
    );

    redeemedCodes.set(req.user.id.toString(), [...userRedeemed, upperCode]);

    res.json({
      success: true,
      message: `🎉 Code redeemed! ${promo.description} added to your account.`,
      data: {
        creditsAdded: promo.credits,
        newBalance,
        description: promo.description,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;