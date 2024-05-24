import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import User from "../models/User.js"

passport.use(
    'google-login',
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/login/callback',
    }, async ( email, googleId, done ) => {
        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return done(null, false, {
                message: "User doesn't exist! Please register first!"
            })
        }

        
    })
)