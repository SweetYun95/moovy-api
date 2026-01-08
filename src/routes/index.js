// moovy-api/src/routes/index.js
import { Router } from 'express'

// 퍼블릭(유저)
import authRouter from './authRoute.js'
import commentRouter from './commentRoute.js'
import replyRouter from './replyRoute.js'
import ratingRouter from './ratingRoute.js'
import favoriteRouter from './favoriteRoute.js'
import qnaRouter from './qnaRoute.js'
import userRouter from './userRoute.js'
import popularRoute from './popularRoute.js'

// 관리자
import adminRouter from './admin/index.js'

const router = Router()

// 기본
router.get('/health', (_req, res) => res.json({ ok: true }))
router.get('/', (_req, res) => res.json({ ok: true, root: true }))

// 퍼블릭
router.use('/auth', authRouter)
router.use('/comments', commentRouter)
router.use('/replies', replyRouter)
router.use('/ratings', ratingRouter)
router.use('/favorites', favoriteRouter)
router.use('/qna', qnaRouter)
router.use('/user', userRouter)
router.use('/popular', popularRoute)

// 어드민 네임스페이스 (app.js에서 /api prefix)
router.use('/admin', adminRouter)

export default router
