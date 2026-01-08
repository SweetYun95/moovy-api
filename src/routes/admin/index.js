// moovy-api/src/routes/admin/index.js
import { Router } from 'express'
import usersRouter from './usersRoute.js'
import authRouter from './authRoute.js'
import qnaRouter from './qnaRoute.js'
import reportsRouter from './reportsRoute.js'

const router = Router()

// /admin/users/*
router.use('/users', usersRouter)
router.use('/auth', authRouter)
router.use('/qna', qnaRouter)
router.use('/reports', reportsRouter)

export default router
