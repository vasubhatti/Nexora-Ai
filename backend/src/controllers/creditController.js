import CreditTransaction from "../models/CreditTransaction.js";
import {getCreditBalance,addCredits} from "../services/creditService.js";

// @desc   Get credit balance
// @route  GET /api/credits/balance
export const getBalance = async(req,res,next)=>{
    try {
        const balance = await getCreditBalance(req.user.id);
        res.json({ success: true, data: balance });
    } catch (error) {
        next(error);
    }
}

// @desc   Get transaction history
// @route  GET /api/credits/history
export const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await CreditTransaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CreditTransaction.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};