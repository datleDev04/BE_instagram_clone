import userService from "../services/user.service.js"

class userController {
    static getUserDetails = async (req, res, next) => {
        try {
            const user = await userService.getUserDetail(req)

            return res.status(200).json({
                message: "get user details successfully",
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

    static changeAvatar = async (req, res, next) => {
        try {
            const user = await userService.changeAvatar(req)

            return res.status(200).json({
                message: "change avatar successfully",
                metaData: user
            })
        } catch (error) {
            next(error)
        }
    }
}


export default userController