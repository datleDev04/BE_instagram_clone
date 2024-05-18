import { StatusCodes } from "http-status-codes"
import userService from "../services/user.service.js"


class userController {

    static getUserProfile = async (req, res, next) => {
        try {
            const user = await userService.getUserProfile(req)

            return res.status(200).json({
                message: "get user profile successfully",
                metaData: user
            })
        } catch (error) {
            next(error)
        }
    }


    static updateInfoUser = async (req, res, next) => {
        try {
            const user = await userService.updateInfoUser(req)

            return res.status(200).json({
                message: "update user details successfully",
                metaData: user
            })
        } catch (error) {
            next(error)
        }
    }
    static getAllFollwers = async (req, res, next) => {
        try {
            const followers = await userService.getAllFollwers(req)

            return res.status(200).json({
                message: "get the followers list successfully",
                metaData: followers
            })
        } catch (error) {
            next(error)
        }
    }
    static getAllFollwings = async (req, res, next) => {
        try {
            const followings = await userService.getAllFollwings(req)

            return res.status(200).json({
                message: "get the following list successfully",
                metaData: followings
            })
        } catch (error) {
            next(error)
        }
    }
    static getAllCloseFriends = async (req, res, next) => {
        try {
            const closeFriends = await userService.getAllCloseFriends(req)

            return res.status(200).json({
                message: "get the close friend list successfully",
                metaData: closeFriends
            })
        } catch (error) {
            next(error)
        }
    }
    static getAllBlocked = async (req, res, next) => {
        try {
            const closeFriends = await userService.getAllBlocked(req)

            return res.status(200).json({
                message: "get the blocked list successfully",
                metaData: closeFriends
            })
        } catch (error) {
            next(error)
        }
    }


    static followAccount = async (req, res, next) => {
        try {
            await userService.followAccount(req, res)

            return res.status(200).json({
                message: "followed successfully",
            })
        } catch (error) {
            next(error)
        }
    }

    static acceptFollowRequest = async (req, res, next) => {
        try {
            await userService.acceptFollowRequest(req)

            return res.status(200).json({
                message: "accepted follow request successfully",
            })
        } catch (error) {
            next(error)
        }
    }
    static rejectFollowRequest = async (req, res, next) => {
        try {
            await userService.rejectFollowRequest(req)

            return res.status(200).json({
                message: "reject follow request successfully",
            })
        } catch (error) {
            next(error)
        }
    }

    static removeFollower = async (req, res, next) => {
        try {
            await userService.removeFollower(req)

            return res.status(200).json({
                message: "remove follower successfully",
            })
        } catch (error) {
            next(error)
        }
    }
    static blockUser = async (req, res, next) => {
        try {
            await userService.blockUser(req)

            return res.status(200).json({
                message: "blocked follower successfully",
            })
        } catch (error) {
            next(error)
        }
    }

    static unBlockUser = async (req, res, next) => {
        try {
            await userService.unBlockUser(req)

            return res.status(200).json({
                message: "unBlocked follower successfully",
            })
        } catch (error) {
            next(error)
        }
    }

    static addCloseFriend = async (req, res, next) => {
        try {
            await userService.addCloseFriend(req)

            return res.status(200).json({
                message: "Add follower of close friends list successfully",
            })
        } catch (error) {
            next(error)
        }
    }
    static removeCloseFriend = async (req, res, next) => {
        try {
            await userService.removeCloseFriend(req)

            return res.status(200).json({
                message: "Remove follower of close friends list successfully",
            })
        } catch (error) {
            next(error)
        }
    }


}


export default userController