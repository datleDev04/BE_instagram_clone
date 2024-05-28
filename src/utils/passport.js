import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import sendEmail from "./mails.js";
import { mailActiveAccount } from "../mail/mailActiveAcount.js";

passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/login/callback",
    },
    async (email, done) => {
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return done(null, false, {
          message: "User doesn't exist! Please register first!",
        });
      }

      const existingToken = await Token.findOne({ user_id: existingUser._id });

      const accessToken = jwtUtils.createAccessToken(existingUser._id);

      if (!existingToken) {
        // create accesstoken and refresh token
        const refreshToken = jwtUtils.createRefreshToken();

        await Token.create({
          user_id: existingUser._id,
          refresh_token: refreshToken,
        });
      } else {
        existingToken.refresh_token = jwtUtils.createRefreshToken();
        existingToken.save();
      }

      return done(null, accessToken);
    }
  )
);

passport.use(
  "google-register",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/register/callback",
    },
    async (email, profile, done) => {
      const existingUser = await User.findOne({ email });
      const user_name = profile.displayName;

      if (existingUser) {
        return done(null, false, {
          message: "User already exists",
        });
      }

      // create a new veryfy code
      const verifyCode = (Math.random() + new Date().getTime())
        .toString()
        .replace(".", "");

      sendEmail(
        email,
        "Active your Instagram account",
        mailActiveAccount(
          `${process.env.CLIENT_BASE_URL}/verify?email=${email}&code=${verifyCode}`
        )
      );

      // create a new user
      const newUser = await User.create({
        user_name,
        email,
        verify_code: verifyCode,
      });

      return done(null, newUser)
    }
  )
);
