import express from 'express'
import userController from '../../controllers/userController.js'
import userValidation from '../../validation/userValidation.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

const userRouter = express.Router()

userRouter.get('/:id', userController.getUserDetails)
userRouter.patch('/:id', authMiddleware ,userValidation.updateInfoUser ,userController.updateInfoUser)
userRouter.patch('/:id', authMiddleware ,userController.changeAvatar)

export default userRouter