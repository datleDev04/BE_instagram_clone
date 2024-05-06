import express from 'express'
import authRouter from './v1/auth.js'

const router = express.Router()

router.use('/v1/auth', authRouter)


export default router