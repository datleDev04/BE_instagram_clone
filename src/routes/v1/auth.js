import express from 'express'
import authValidation from '../../validation/authValidation.js'
import authController from '../../controllers/authController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
const authRouter = express.Router()
import passport from 'passport';

// normal login reigster
authRouter.post("/register", authValidation.registerValidation, authController.register)
authRouter.post("/login", authValidation.loginValidation, authController.login)


// register login with google
authRouter.get("/google/login", passport.authenticate('google-login', {
    scope: ['profile', 'email']
}))
authRouter.get("/google/register", passport.authenticate('google-register', {
    scope: ['profile', 'email']
}))


authRouter.get("/google/login/callback", passport.authenticate('google-login'), (req, res) => {
    res.redirect(`/`);
})
authRouter.get("/google/register/callback", passport.authenticate('google-register'), (req, res) => {
    res.redirect(`/`);
})


authRouter.post("/logout", authMiddleware,  authController.logout)


authRouter.post("/forgot-password", authController.forgotPassword)  
authRouter.post("/reset-password/:token", authController.resetPassword)  


authRouter.post("/refresh-token", authController.refreshToken)
authRouter.post("/reSend-verifyCode", authMiddleware, authController.reSendVerifyCode)
authRouter.post("/verifyCode", authMiddleware, authController.verifyCode)


export default authRouter