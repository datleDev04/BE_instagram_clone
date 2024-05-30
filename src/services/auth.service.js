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
import userUtils from "../utils/user.js"
import jwt from 'jsonwebtoken'
import { token } from "morgan"

class authService {
    static register = async (reqBody) => {
        const { user_name, email, password ,confirm_password } = reqBody


        // check exitsted Email
        const existedEmail = await User.findOne({ email })
        if (existedEmail) {
            throw new ApiError(409, "Email already existed")
        }

        // check exitsted user_name
        const existedUserName = await User.findOne({ user_name })
        if (existedUserName) {
            throw new ApiError(409, "user_name already existed")
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

    static login = async (req) => {
        const { email, password } = req.body

        // find user by email
        const user = await User.findOne({ email })

        if (!user) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Couldn't find User")
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new ApiError(401, "Wrong password")
        }

        // check account status
        userUtils.checkUserStatus(user.status)

        // Lấy thông tin thiết bị và địa chỉ IP
        const deviceInfo = req.headers['user-agent'];
        const ipAddress = req.ip;

        // create access token
        const accessToken = jwtUtils.createAccessToken(user._id)

        // create refresh token
        let refreshToken = jwtUtils.createRefreshToken()

        await Token.create({
            user_id: user._id,
            refresh_token: refreshToken,
            device_info: deviceInfo,
            ip_address: ipAddress,
        });


        return {
            user,
            accessToken,
            refreshToken
        }
    }

    static logout = async (req) => {
        const { user_id } = jwtUtils.decodeToken(req.user.accessToken)
        const { refreshToken, logoutAll, deviceInfo , ipAddress  } = req.body;


        // loug out all devices
        if (logoutAll == true) {
            const refreshTokenDocs = await Token.find({ 
                user_id: user_id,
                // tất cả các token trừ refreshtoken hiện tại đang sử dụng
                refresh_token: { $ne: refreshToken }
            })
            refreshTokenDocs.forEach(async (refreshTokenDoc) => {
                await Black_tokens.create({ refresh_token: refreshTokenDoc.refresh_token })
            })
        } else if (deviceInfo && ipAddress) {
            const refreshTokenDocs = await Token.find({
                device_info: deviceInfo,
                ip_address: ipAddress,
                user_id: user_id,
                refresh_token: { $ne: refreshToken }
            })

            refreshTokenDocs.forEach(async (refreshTokenDoc) => {
                await Black_tokens.create({ refresh_token: refreshTokenDoc.refresh_token })
            })

            await Token.deleteMany({
                user_id: user_id,
                device_info: deviceInfo,
                ip_address: ipAddress,
                refresh_token: { $ne: refreshToken }
            })
        } else {
            await Black_tokens.create({ refresh_token: refreshToken })
            await Token.findOneAndDelete({ refresh_token: refreshToken });
        }
    }

    static refreshToken = async (req) => {
        const refreshToken = req.body.refreshToken

        if (!refreshToken) throw new ApiError(StatusCodes.BAD_REQUEST, "refresh token is required")
        
        // check valid token
        const decodeToken = jwtUtils.decodeRefreshToken(refreshToken)
        if (!decodeToken) throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token")

        const tokenInfo = await Token.findOne({
            refresh_token: refreshToken
        })

        if (!tokenInfo) throw new ApiError(StatusCodes.UNAUTHORIZED, "token is unauthorized")



        tokenInfo.refresh_token = jwtUtils.createRefreshToken(),
        tokenInfo.save()

        const access_token = jwtUtils.createAccessToken(tokenInfo.user_id)

        return {
            access_token: access_token,
            refresh_token: tokenInfo.refresh_token,
        }
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
            mailActiveAccount(
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