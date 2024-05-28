import { StatusCodes, getStatusCode } from "http-status-codes"
import User from "../models/User.js"
import ApiError from "../utils/ApiError.js"
import cloudinary from "../configs/cloudinary.js"
import Follower from "../models/Follower.js"
import Following from "../models/Following.js"
import closeFriend from "../models/closeFriend.js"
import Blocked from "../models/Blocked.js"
import bcrypt from 'bcrypt'

class userService {

    // get the user profile
    static getUserProfile = async ( req )  => {
        const { id } = req.params

        const user = await User.findById(id)

        if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
        

        return user
    }

    // update info user
    static updateInfoUser = async ( req ) => {
        const { id } = req.params

        const file = req.file

        const uploadedImage = await cloudinary.uploader.upload(file.path);

        const userUpdate = await User.findById(id)

        if (!userUpdate) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
        }

        if (userUpdate.avatar){
            // delete the old avatar on cloudinary
            const result = await cloudinary.uploader.destroy(userUpdate.avatar_publicId)
            const resultFile = await cloudinary.uploader.destroy(userUpdate.avatar_fileName)

            if (result.error && resultFile.error ) {
                throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'delete old avatar on cloudinary unsuccesfully' )
            }
        }

        let updatedData = { ...req.body };

        if (req.body.phone) {
            const exitstedPhone = await User.findOne({ phone: req.body.phone })
            if (exitstedPhone){
                throw new ApiError(StatusCodes.BAD_REQUEST, "This phone is already used")
            }
        }

        if (req.body.password) {
            updatedData.password = bcrypt.hashSync(req.body.password, 10);
        }
        
        if (uploadedImage) {
            updatedData.avatar = uploadedImage.secure_url;
            updatedData.avatar_publicId = uploadedImage.public_id;
            updatedData.avatar_fileName = `avatar-insta/${uploadedImage.original_filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(id, { ...updatedData } , { new: true })

        if (!updatedUser) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, getStatusCode(StatusCodes.INTERNAL_SERVER_ERROR))

        return updatedUser
    }

    // get the followers
    static getAllFollwers = async ( req ) => {
        const { id } = req.params

        const {
            _limit = 10,
            _page = 1,
        } = req.query;

        const options = {
            page: _page,
            limit: _limit
        }

        const follwers = await Follower.paginate({ user_id: id }, options)

        if (follwers.length === 0){
            return []
        }

        return follwers

    }
    
    // get the follwings
    static getAllFollwings = async ( req ) => {
        const { id } = req.params

        const {
            _limit = 10,
            _page = 1,
        } = req.query;

        const options = {
            page: _page,
            limit: _limit
        }

        const follwers = await Following.paginate({ user_id: id }, options)

        if (follwers.length === 0){
            return []
        }

        return follwers

    }

    // get the close friends
    static getAllCloseFriends = async ( req ) => {
        const { id } = req.params

        const {
            _limit = 10,
            _page = 1,
        } = req.query;

        const options = {
            page: _page,
            limit: _limit
        }

        const follwers = await closeFriend.paginate({ user_id: id }, options)

        if (follwers.length === 0){
            return []
        }

        return follwers

    }

    // get the blocked list
    static getAllBlocked = async ( req ) => {
        const { id } = req.params

        const {
            _limit = 10,
            _page = 1,
        } = req.query;

        const options = {
            page: _page,
            limit: _limit
        }

        const follwers = await Blocked.paginate({ user_id: id }, options)

        if (follwers.length === 0){
            return []
        }

        return follwers

    }

    // add a user to the block list
    static blockUser = async ( req, res ) => {
        const { id } = req.params

        const user_id = await req.user._doc._id

        let blockedDoc = await Blocked.findOne({ user_id: user_id})

        if (!blockedDoc) {
            blockedDoc = await Blocked.create({
                user_id: user_id
            })
        }
        
        await Blocked.findOneAndUpdate(
            { user_id: user_id },
            { $push: { bocked_list : id }},
            { new: true }
        )

        await blockedDoc.save()
    }

    // remove a user out of the block list
    static unBlockUser = async ( req, res ) => {
        const { id } = req.params

        const user_id = await req.user._doc._id

        // remove from pending follower
        await Blocked.findOneAndUpdate(
            { user_id: user_id },
            { $pull: { bocked_list : id }},
            { new: true }
        )
    }


    // follow a account
    static followAccount = async ( req, res ) => {
        // id của người mình muốn follow
        const { id } = req.params
        // console.log(req.user._doc._id)

        // user id from auth middleware
        const user_id = await req.user._doc._id

        let followerDoc = await Follower.findOne({ user_id: user_id})

        const user = await User.findById(id)

        if (!followerDoc) {
            followerDoc = await Follower.create({
                user_id: user_id
            })
        }

        if (user.privateAccount === true) {
            followerDoc.pendingFollowers.push(id)

            await followerDoc.save()

            return res.status(200).json({
                message: "send follow request successfully",
            })
        } else {
            followerDoc.followers.push(id)
        }

        await followerDoc.save()
    }

    // accpet a follower request
    static acceptFollowRequest = async ( req ) => {
        // id của người mình muốn cho follow
        const { id } = req.params

        // user id from auth middleware
        const user_id = await req.user._doc._id


        // remove from pending follower
        await Follower.findOneAndUpdate(
            { user_id: user_id },
            { $pull: { pendingFollowers: id }},
            { new: true }
        )

        // add to follower
        await Follower.findOneAndUpdate(
            { user_id: user_id },
            { $push: { followers: id }},
            { new: true }
        )
    }

    // reject a follower request
    static rejectFollowRequest = async ( req ) => {
        // id của người mình muốn cho follow
        const { id } = req.params

        // user id from auth middleware
        const user_id = await req.user._doc._id


        // remove from pending follower
        await Follower.findOneAndUpdate(
            { user_id: user_id },
            { $pull: { pendingFollowers: id }},
            { new: true }
        )
    }

    // remove follower
    static removeFollower = async ( req ) => {
        // id của người mình muốn xóa follow
        const { id } = req.params

        // user id from auth middleware
        const user_id = await req.user._doc._id

        const followerDoc = await Follower.findOneAndUpdate(
            { user_id: user_id },
            { $pull: { followers: id }},
            { new: true }
        )

        if (!followerDoc) {
          throw new ApiError(StatusCodes.BAD_REQUEST, "No user found")
        }
    }


    // add follower to close friend list
    static addCloseFriend = async ( req ) => {
        // id của người mình muốn thêm vào danh sách bạn thân
        const { id } = req.params

        // user id from auth middleware
        const user_id = await req.user._doc._id

        // kiểm tra xem người đó có trong danh sách follower không
        const user = await Follower.findOne({
            user_id: user_id,
            followers: { $elemMatch: { $eq: id } }
        });

        if (!user) throw new ApiError(StatusCodes.BAD_REQUEST, "The user does not exits in your follower list")
        
        // kiểm tra đã tồn tại bản ghi close fr của người dùng đó chưa
        // nếu chưa thì tạo mới
        const closeFriendsDoc = await closeFriend.findOne({ user_id: user_id })
        if (!closeFriendsDoc) {
            await closeFriend.create({ user_id: user_id })
        }
            
        // tạo mới xong thì thêm vào danh sách bạn thân
        await closeFriend.findOneAndUpdate(
            { user_id: user_id },
            { $push: { closeFriends: id }},
            { new: true }
        )
    }
    // remove follower of closefr list
    static removeCloseFriend = async ( req ) => {
        // id của người mình muốn xóa khỏi danh sách bạn thân
        const { id } = req.params

        // user id from auth middleware
        const user_id = await req.user._doc._id

        // kiểm tra xem người đó có trong danh sách close friend không
        const user = await closeFriend.findOne({
            user_id: user_id,
            closeFriends: { $elemMatch: { $eq: id } }
        });

        if (!user) throw new ApiError(StatusCodes.BAD_REQUEST, "The user does not exits in your close friends list")

        // loại khỏi danh sách bạn thân
        await closeFriend.findOneAndUpdate(
            { user_id: user_id },
            { $pull: { closeFriends: id }},
            { new: true }
        )
    }
}

export default userService