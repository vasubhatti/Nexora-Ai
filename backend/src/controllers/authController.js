import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { generateAccessToken,generateRefreshToken,verifyRefreshToken } from "../utils/jwt.js";

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req,res,next)=>{
    try {
        const {name,email,password} = req.body;

        //check if user exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return next(new AppError("Email already registered.",400))
        }

        // Create user
        const user = await User.create({name,email,password});

        // Generate Tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id); 

        // save refresh token to db
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                credits: user.credits,
                subscription: user.subscription,
            },
        })

    } catch (error) {
        next(error);
    }
}

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req,res,next)=>{
    try {
        const {email,password} = req.body;

        //Find user with password
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return next(new AppError("Invalid email or password.", 401));
        }

        //Check password
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return next(new AppError("Invalid email or password.", 401));
        }

        //Generate Tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        //Save refresh token to Db
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});

        res.json({
            success: true,
            message: "Logged in successfully",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                credits: user.credits,
                subscription: user.subscription,
            },
        })
    } catch (error) {
        next(error);
    }
}

// @desc    Refresh access token
// @route   POST /api/auth/refresh
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new AppError("Refresh token required.", 400));
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user and check token matches
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError("Invalid refresh token.", 401));
    }

    // Issue new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(new AppError("Invalid or expired refresh token.", 401));
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = async (req,res,next)=>{
    try {
        await User.findByIdAndUpdate(req.user.id,{refreshToken:null});
        res.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
}

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req,res,next)=>{
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            user:user,
        });
    } catch (error) {
        next(error);
    }
}

export const googleCallback = async (req,res,next)=>{
    try {
        const user = req.user;

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id)

        user.refreshToken = refreshToken;
         await user.save({ validateBeforeSave: false });
        
          res.json({
            success: true,
            message: "Google login successful",
            accessToken,
            refreshToken: refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                credits: user.credits,
                subscription: user.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
}