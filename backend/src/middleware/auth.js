import {verifyAccessToken} from "../utils/jwt.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

export const protect = async (req,res,next)=>{
    try {
        
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return next(new AppError("Access denied. No token provided.", 401));
        }

        const token = authHeader.split(" ")[1];

        const decode = verifyAccessToken(token);

        const user = await User.findById(decode.id);

        if (!user) {
            return next(new AppError("User no longer exists.", 401));
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new AppError("Token expired. Please login again.", 401));
        }
        return next(new AppError("Invalid token.", 401));
    }
}

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};