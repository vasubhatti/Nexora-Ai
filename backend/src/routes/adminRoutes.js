import express from "express";
import User from "../models/User.js";
import Generation from "../models/Generation.js";
import CreditTransaction from "../models/CreditTransaction.js";
import { adminOnly } from "../middleware/adminAuth.js";
import { addCredits, deductCredits } from "../services/creditService.js";

const router = express.Router();

// ── Stats ────────────────────────────────────────────────
// GET /api/admin/stats
router.get("/stats", adminOnly, async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      bannedUsers,
      totalGenerations,
      totalCreditsUsed,
      newUsersToday,
      generationsToday,
      subscriptionCounts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: { $ne: true } }),
      User.countDocuments({ isBanned: true }),
      Generation.countDocuments(),
      User.aggregate([
        { $group: { _id: null, total: { $sum: "$creditsUsed" } } },
      ]),
      User.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Generation.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      User.aggregate([
        { $group: { _id: "$subscription", count: { $sum: 1 } } },
      ]),
    ]);

    const subCounts = { free: 0, pro: 0, enterprise: 0 };
    subscriptionCounts.forEach((s) => {
      subCounts[s._id] = s.count;
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        bannedUsers,
        totalGenerations,
        totalCreditsUsed: totalCreditsUsed[0]?.total || 0,
        newUsersToday,
        generationsToday,
        subscriptions: subCounts,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ── Users ────────────────────────────────────────────────
// GET /api/admin/users
router.get("/users", adminOnly, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const subscription = req.query.subscription || "";

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (subscription) query.subscription = subscription;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/users/:id
router.get("/users/:id", adminOnly, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const generations = await Generation.countDocuments({ user: req.params.id });
    const recentGenerations = await Generation.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("type prompt creditsUsed createdAt");

    res.json({
      success: true,
      data: { user, generations, recentGenerations },
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/users/:id/ban
router.patch("/users/:id/ban", adminOnly, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Cannot ban an admin." });
    }

    user.isBanned = !user.isBanned;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: user.isBanned ? "User banned." : "User unbanned.",
      data: { isBanned: user.isBanned },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", adminOnly, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Cannot delete an admin." });
    }

    await User.findByIdAndDelete(req.params.id);
    await Generation.deleteMany({ user: req.params.id });

    res.json({ success: true, message: "User and their data deleted." });
  } catch (error) {
    next(error);
  }
});

// ── Credits ──────────────────────────────────────────────
// POST /api/admin/users/:id/credits
router.post("/users/:id/credits", adminOnly, async (req, res, next) => {
  try {
    const { amount, type, reason } = req.body;

    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ success: false, message: "Valid amount required." });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const parsedAmount = Math.abs(Number(amount));

    let newBalance;
    if (type === "deduct") {
      newBalance = await deductCredits(
        req.params.id,
        parsedAmount,
        reason || "Admin deduction",
        "ADMIN_DEDUCT"
      );
    } else {
      newBalance = await addCredits(
        req.params.id,
        parsedAmount,
        reason || "Admin credit grant",
        "bonus"
      );
    }

    res.json({
      success: true,
      message: `${parsedAmount} credits ${type === "deduct" ? "deducted from" : "added to"} account.`,
      data: { newBalance },
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/users/:id/role
router.patch("/users/:id/role", adminOnly, async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password -refreshToken");

    res.json({ success: true, message: `Role updated to ${role}.`, data: user });
  } catch (error) {
    next(error);
  }
});

export default router;