import { StatusCodes, getStatusCode } from "http-status-codes"
import User from "../models/User.js"
import ApiError from "../utils/ApiError.js"

class userService {
    static getUserDetail = async (req) => {
        const { id } = req.params
        console.log(id)

        const user = await User.findById(id)

        if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found")

        return user

    }

    static updateInfoUser = async ( req ) => {
        const { id } = req.params

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true })

        if (!updatedUser) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, getStatusCode(StatusCodes.INTERNAL_SERVER_ERROR))

        return updatedUser
    }

    static changeAvatar = async ( req ) => {
        const { id } = req.params
        const file = req.files
    }
}

export default userService