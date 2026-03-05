import jwt from "jsonwebtoken";

export const generateAccessToken = (userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn: "7d"
    })
}

export const generateRefreshToken = (userId)=>{
    return jwt.sign({id:userId},process.env.JWT_REFRESH_SECRET,{
        expiresIn:"30d"
    })
}

export const verifyAccessToken = (token)=>{
    return jwt.verify(token,process.env.JWT_SECRET);
}

export const verifyRefreshToken = (token)=>{
    return jwt.verify(token,process.env.JWT_REFRESH_SECRET);
}