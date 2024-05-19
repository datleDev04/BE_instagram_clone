import User from "../models/User.js"
import ApiError from "../utils/ApiError.js"
import bcrypt from 'bcrypt'
import jwtUtils from "../utils/jwt.js"
import Black_tokens from "../models/Black_tokens.js"
import { StatusCodes } from "http-status-codes"
import Token from "../models/token.js"
import sendEmail from "../utils/mails.js"
import {  mailActiveAccount } from "../mail/mailActiveAcount.js"
import { mailForgotPassword } from "../mail/mailForgotPassword.js"

class authService {
    static register = async (reqBody) => {
        const { user_name, email, password ,confirm_password } = reqBody


        // check exitsted Email
        const existedEmail = await User.findOne({ email })
        if (existedEmail) {
            throw new ApiError(409, "Email already existed")
        }

        // check password and confirm_password
        if (password !== confirm_password) {
            throw new ApiError(400, "Passwords don't match")
        }

        // create a new veryfy code 
        const verifyCode = (Math.random() + new Date().getTime())
        .toString()
        .replace(".", "");

        sendEmail(email,
            "Active your Instagram account",
            mailActiveAccount(
                `${process.env.CLIENT_BASE_URL}/verify?email=${email}&code=${verifyCode}`
            )
        )


        // create a new user
        const newUser = await User.create({
            user_name,
            email,
            password: bcrypt.hashSync(password, 10),
            verify_code: verifyCode,
        })

        return newUser
    }

    static login = async (reqBody) => {
        const { email, password } = reqBody

        // find user by email
        const user = await User.findOne({ email })

        if (!user) {
            throw new ApiError(404, "Couldn't find User")
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new ApiError(401, "Wrong password")
        }


        // create accesstoken and refresh token
        const accessToken = jwtUtils.createAccessToken(user._id)
        const refreshToken = jwtUtils.createRefreshToken()

        await Token.create({
            user_id: user._id,
            refresh_token: refreshToken,
        })

        return {
            user,
            accessToken
        }
    }

    static logout = async (accessToken) => {
        const { user_id } = jwtUtils.decodeToken(accessToken)

        await Black_tokens.create({
            user_id,
            access_token: accessToken,
        })

        await Token.findOneAndDelete({ user_id })
    }

    static refreshToken = async (reqBody) => {
        const refreshToken = reqBody.refreshToken

        if (!refreshToken) throw new ApiError(StatusCodes.BAD_REQUEST, "refresh token is required")

        const tokenInfo = await Token.findOne({ refresh_token: refreshToken })
        if (!tokenInfo) throw new ApiError(StatusCodes.UNAUTHORIZED, "token is unauthorized")


        await Token.findOneAndUpdate({ user_id: tokenInfo.user_id }, {
            refresh_token: jwtUtils.createRefreshToken(),
        })

        const access_token = jwtUtils.createAccessToken(tokenInfo.user_id)

        return access_token
    }

    static reSendVerifyCode = async (accessToken) => {
        const { user_id } = jwtUtils.decodeToken(accessToken)

        const newVerifyCode = (Math.random() + new Date().getTime())
        .toString()
        .replace(".", "");

        const user = await User.findOneAndUpdate({ _id: user_id, status: 0}, {
            verify_code: newVerifyCode,
        })

        if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found")

        sendEmail(
            user.email,
            "Active your Instagram account (new verify code)",
            activeAccount(
                `${process.env.CLIENT_BASE_URL}/verify?email=${user.email}&code=${newVerifyCode}`
            )
        )
    }

    static verifyCode = async (reqBody) => {
        const { verifyCode } = reqBody

        if (!verifyCode) throw new ApiError(StatusCodes.BAD_REQUEST, "Verify code is required")

        const user = await User.findOne({ verify_code: verifyCode, status: 0 })

        if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid vertify code")

        user.verify_code = null
    }

    static forgotPassword = async (reqBody) => {
        const { email } = reqBody

        if (!email) throw new ApiError(StatusCodes.BAD_REQUEST, "email is required")

        const user = await User.findOne({ email })
        if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found")

        user.resetPassword_Token = jwtUtils.createAccessToken(user._id)

        user.save()

        sendEmail(
            user.email,
            "Reset Your Instagram Account Password",
            mailForgotPassword(
                `${process.env.CLIENT_BASE_URL}/auth/reset-password/${user.resetPassword_Token}`
            )
        )
    }

    static resetPassword = async ( req ) => {
        const { password, confirm_password } = req.body

        const resetPassword_Token = req.params.token

        const decode = jwtUtils.decodeToken(resetPassword_Token)

        const user = await User.findOne({ _id: decode.user_id })
        if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or Token expired")

        if (password !== confirm_password) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Passwords don't match")
        }

        user.password = bcrypt.hashSync(password, 10)
        user.resetPassword_Token = null

        user.save()
    }
}

export default authService