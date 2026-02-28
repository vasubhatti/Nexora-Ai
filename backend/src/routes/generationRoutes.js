import express from "express";
const router = express.Router();
import { protect }from "../middleware/auth.js";
import Generation  from "../models/Generation.js";

// GET /api/generations — get user's generation history with search & filter
router.get("/", protect, async (req, res, next) => {
  try {
    const { type, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { user: req.user.id };
    if (type) query.type = type;
    if (search) query.prompt = { $regex: search, $options: "i" };

    const generations = await Generation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Generation.countDocuments(query);

    res.json({
      success: true,
      data: generations,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) { next(error); }
});

// DELETE /api/generations/:id
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const generation = await Generation.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!generation) return res.status(404).json({ success: false, message: "Generation not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) { next(error); }
});

export default router;