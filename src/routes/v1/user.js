import express from 'express'
import userController from '../../controllers/userController.js'
import userValidation from '../../validation/userValidation.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from '../../configs/cloudinary.js';

const userRouter = express.Router()



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "avatar-insta",
    },
  });
  
const upload = multer({ storage: storage });

// get the profile account
userRouter.get('/:id/profile',authMiddleware, userController.getUserProfile)

// update infor of the user
userRouter.patch('/:id', 
  authMiddleware,
  upload.single('avatar'),
  userValidation.updateInfoUser,
  userController.updateInfoUser
)



// get the follower
userRouter.get('/:id/followers',authMiddleware, userController.getAllFollwers)

// get the followings account
userRouter.get('/:id/followings',authMiddleware, userController.getAllFollwings)

// get the close friends list
userRouter.get('/:id/closefriends', authMiddleware,userController.getAllCloseFriends)

// get the blocked list
userRouter.get('/:id/blocked',authMiddleware, userController.getAllBlocked)

// follow a person with public account
// send follow request with private account
userRouter.patch('/follow/:id', authMiddleware, userController.followAccount)

// accept a follow request
userRouter.patch('/acceptFollowRequest/:id', authMiddleware, userController.acceptFollowRequest)

// reject a follow request
userRouter.patch('/rejectFollowRequest/:id', authMiddleware, userController.rejectFollowRequest)

// remove a follower
userRouter.patch('/removeFollower/:id', authMiddleware, userController.removeFollower)


// add a user to the block list
userRouter.patch('/blockUser/:id', authMiddleware, userController.blockUser)

// remove a user out of the block list
userRouter.patch('/unBlockUser/:id', authMiddleware, userController.unBlockUser)


// add a user to the close friends list
userRouter.patch('/addCloseFriend/:id', authMiddleware, userController.addCloseFriend)

// remove a user out of close friends list
userRouter.patch('/removeCloseFriend/:id', authMiddleware, userController.removeCloseFriend)



export default userRouter