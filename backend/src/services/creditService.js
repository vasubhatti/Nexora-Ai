import User from "../models/User.js";
import CreditTransaction from "../models/CreditTransaction.js";
import AppError from "../utils/AppError.js";
import {SUBSCRIPTION_CREDITS} from "../config/creditCosts.js";

// Check and reset credits if month has passed
export const checkAndResetCredits = async (user)=> {
    try {
        const now = new Date();
        if(now >= user.creditsResetDate){
            const monthlyCredits = SUBSCRIPTION_CREDITS[user.subscription];

            user.creditBalance = monthlyCredits;
            user.creditsUsed = 0;
            user.creditsResetDate = new Date(now.setMonth(now.getMonth() + 1));
            await user.save({ validateBeforeSave: false });

            await CreditTransaction.create({
                user: user._id,
                type: "reset",
                amount: monthlyCredits,
                balanceAfter: monthlyCredits,
                description: `Monthly credit reset - ${user.subscription} plan`
            })
        }
        return user;
    } catch (error) {
        console.log(error);
    }
}

export const deductCredits = async (userId,action,cost)=> {
    try {
        let user = await User.findById(userId);
        if(!user) throw new AppError("User not found.", 404);

        // Check and reset if needed
        user = await checkAndResetCredits(user);

        // Check if enough credits
        if(user.creditBalance < cost){
            throw new AppError(
                `Insufficient credits. You need ${cost} credits but have ${user.creditBalance}.`,
                402
            );
        }

        //Deduct
        user.creditBalance -= cost;
        user.creditsUsed += cost;
        await user.save({validateBeforeSave:false});

        //Log transaction
        await CreditTransaction.create({
            user: userId,
            type: "deduction",
            amount: cost,
            balanceAfter: user.creditBalance,
            description: `Used ${cost} credits for ${action}`,
            action,
        });
        return user.creditBalance;
    } catch (error) {
        console.log(error)
    }
}

// Add credits (top-up or bonus)
export const addCredits = async (userId,amount,description,type = "topup")=> {
    try {
        let user = await User.findById(userId);
        if(!user) throw new AppError("User not found.", 404);

        user.creditBalance += amount;
        await user.save({validateBeforeSave:false});

        await CreditTransaction.create({
            user: user._id,
            type,
            amount,
            balanceAfter : user.creditBalance,
            description
        })
        return user.creditBalance;
    } catch (error) {
        console.log(error);
    }
}

export const getCreditBalance = async (userId)=> {
    try {
        let user = await User.findById(userId);
        if(!user) throw new AppError("User not found.", 404);

        return {
            creditBalance: user.creditBalance,
            creditsUsed: user.creditsUsed,
            creditsResetDate: user.creditsResetDate,
            subscription: user.subscription,
        };
    } catch (error) {
        console.log(error)
    }
}
