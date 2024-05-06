import express from 'express'
import authValidation from '../../validation/authValidation.js'
import authController from '../../controllers/authController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

const authRouter = express.Router()

authRouter.post("/register", authValidation.registerValidation, authController.register)
authRouter.post("/login", authValidation.loginValidation, authController.login)
authRouter.post("/logout", authMiddleware,  authController.logout)


authRouter.post("/refresh-token", authController.refreshToken)
authRouter.post("/reSend-verifyCode", authMiddleware, authController.reSendVerifyCode)
authRouter.post("/verifyCode", authMiddleware, authController.verifyCode)


export default authRouter