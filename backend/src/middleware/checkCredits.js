import { CREDIT_COSTS } from "../config/creditCosts.js";
import { deductCredits } from "../services/creditService.js";
import AppError from "../utils/AppError.js";

const checkCredits =  (action)=> {
    return async (req,res,next) => {
        try {
            const cost = CREDIT_COSTS[action];
            if(!cost) return next(new AppError("Invalid action type.", 400));

            // Deduct credits — throws if insufficient
            const remainingCredits = await deductCredits(req.user.id,cost,action);

            // Attach to request so controller knows cost and balance
            req.creditCost = cost;
            req.remainingCredits = remainingCredits;
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default checkCredits;