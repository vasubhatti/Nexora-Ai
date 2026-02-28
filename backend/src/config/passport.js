import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (googleAccessToken, googleRefreshToken,profile,done)=>{
        try {
            const email = profile.emails[0].value;
            const name = profile.displayName;

            //Check if user already exist
            let user = await User.findOne({email});
            if(user){
                //User exists, just return them
                return done(null,user);
            }
            // New user — create account (no password needed for Google users)
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-16), // dummy password, never used
                isVerified: true, // Google already verified the email
            });
            return done(null, user);
        } catch (error) {
             return done(error, null);
        }
    }
  )
)
export default passport;