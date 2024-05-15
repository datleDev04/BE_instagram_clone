import express from 'express'
import authRouter from './v1/auth.js'
import userRouter from './v1/user.js'

const router = express.Router()

router.use('/v1/auth', authRouter)
router.use('/v1/user', userRouter)


export default router