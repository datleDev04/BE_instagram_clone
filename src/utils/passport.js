import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import sendEmail from "./mails.js";
import { mailActiveAccount } from "../mail/mailActiveAcount.js";
import userUtils from "./user.js";

passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/login/callback",
    },
    async (email, req, done) => {
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return done(null, false, {
          message: "User doesn't exist! Please register first!",
        });
      }

      // check account status
      userUtils.checkUserStatus(existingUser.status)

      // Lấy thông tin thiết bị và địa chỉ IP
      const deviceInfo = req.headers['user-agent'];
      const ipAddress = req.ip;

      // create access token
      const accessToken = jwtUtils.createAccessToken(existingUser._id)

      // create refresh token
      let refreshToken = jwtUtils.createRefreshToken()

      await Token.create({
          user_id: existingUser._id,
          refresh_token: refreshToken,
          device_info: deviceInfo,
          ip_address: ipAddress,
      });

      return done(null, accessToken, refreshToken);
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
