import User from "../models/User.js";
import CreditTransaction from "../models/CreditTransaction.js";

export const checkAndResetCredits = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const now = new Date();
  const resetDate = new Date(user.creditsResetDate);

  if (now >= resetDate) {
    const planCredits = {
      free: 100,
      pro: 1000,
      enterprise: 10000,
    };

    const newCredits = planCredits[user.subscription] || 100;
    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);

    user.creditBalance = newCredits;
    user.creditsUsed = 0;
    user.creditsResetDate = nextReset;
    await user.save({ validateBeforeSave: false });

    await CreditTransaction.create({
      user: userId,
      type: "reset",
      amount: newCredits,
      balanceAfter: newCredits,
      description: `Monthly credit reset — ${user.subscription} plan`,
      action: "MONTHLY_RESET",
    });
  }

  return user;
};

export const deductCredits = async (userId, amount, action) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  await checkAndResetCredits(userId);

  const freshUser = await User.findById(userId);

  if (freshUser.creditBalance < amount) {
    const err = new Error("Insufficient credits");
    err.statusCode = 402;
    throw err;
  }

  freshUser.creditBalance -= amount;
  freshUser.creditsUsed += amount;
  await freshUser.save({ validateBeforeSave: false });

  // Make sure amount is always a valid positive number
  const safeAmount = Number(amount);
  if (isNaN(safeAmount)) throw new Error("Invalid credit amount");

  await CreditTransaction.create({
    user: userId,
    type: "deduction",
    amount: safeAmount,        // store as positive number
    balanceAfter: freshUser.creditBalance,
    description:  "Credit deduction",
    action: action || "UNKNOWN",
  });

  return freshUser.creditBalance;
};

export const addCredits = async (userId, amount, description, type = "topup") => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.creditBalance += amount;
  await user.save({ validateBeforeSave: false });

  await CreditTransaction.create({
    user: userId,
    type,
    amount,
    balanceAfter: user.creditBalance,
    description,
    action: type.toUpperCase(),
  });

  return user.creditBalance;
};

export const getCreditBalance = async (userId) => {
  await checkAndResetCredits(userId);
  const user = await User.findById(userId);
  return {
    creditBalance: user.creditBalance,
    creditsUsed: user.creditsUsed,
    creditsResetDate: user.creditsResetDate,
    subscription: user.subscription,
  };
};