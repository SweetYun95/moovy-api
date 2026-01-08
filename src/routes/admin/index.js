// moovy-api/src/routes/admin/index.js
import { Router } from 'express'
import usersRouter from './usersRoute.js'
import authRouter from './authRoute.js'
import qnaRouter from './qnaRoute.js'
import dashboardRouter from './dashboardRoute.js' // ✅ 추가
import topicsRouter from './topicsRoute.js' // ✅ 추가

const router = Router()

router.use('/users', usersRouter)
router.use('/auth', authRouter)
router.use('/qna', qnaRouter)
router.use('/dashboard', dashboardRouter) // ✅ 추가
router.use('/topics', topicsRouter) // ✅ 추가

export default router
