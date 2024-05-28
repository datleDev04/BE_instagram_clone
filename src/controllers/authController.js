import { StatusCodes } from "http-status-codes";
import authService from "../services/auth.service.js";

class authController {
    static register = async (req, res, next) => {
        try {
            const newUser = await authService.register(req.body)

            res.status(StatusCodes.OK).json({
                message: "Registration successfully",
                metaData: newUser
            })
        } catch (error) {
            next(error);
        }
    }
    static login = async (req, res, next) => {
        try {
            const { user, accessToken } = await authService.login(req.body)

            res.status(StatusCodes.OK).json({
                message: "Login successfully",
                metaData: {
                    userData: user,
                    accessToken: accessToken
                }
            })
        } catch (error) {
            next(error);
        }
    }
    static logout = async (req, res, next) => {
        try {
            await authService.logout(req.user.accessToken)

            res.status(StatusCodes.OK).json({
                message: "Logout successfully",
            })
        } catch (error) {
            next(error);
        }
    }


    static forgotPassword = async (req, res, next) => {
        try {
            await authService.forgotPassword(req.body)

            res.status(StatusCodes.OK).json({
                message: "send mail forgot password successfully",
            })
        } catch (error) {
            next(error);
        }
    }
    static resetPassword = async (req, res, next) => {
        try {
            await authService.resetPassword(req)

            res.status(StatusCodes.OK).json({
                message: "reset password successfully",
            })
        } catch (error) {
            next(error);
        }
    }

    static refreshToken = async (req, res, next) => {
        try {
            const newAccess_token = await authService.refreshToken(req.body)

            res.status(StatusCodes.OK).json({
                message: "Refresh token successfully",
                accessToken: newAccess_token
            })
        } catch (error) {
            next(error)
        }
    }

    static reSendVerifyCode = async (req, res, next) => {
        try {
            await authService.reSendVerifyCode(req.user.accessToken)

            res.status(StatusCodes.OK).json({
                message: "Resend verify code successfully",
            })
        } catch (error) {
            next(error)
        }
    }

    static verifyCode = async (req, res, next) => {
        try {
            await authService.verifyCode(req.body)

            res.status(StatusCodes.OK).json({
                message: "Active account successfully",
            })
        } catch (error) {
            next(error)
        }
    }
    
}

export default authController