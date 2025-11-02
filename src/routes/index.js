// moovy-api/src/routes/index.js
import { Router } from 'express'

// 퍼블릭(유저)
import authRouter from './auth.js'
import commentRouter from './comment.js'
import replyRouter from './reply.js'

// 관리자
import adminRouter from './admin/index.js' // <- 추가

const router = Router()

// 기본
router.get('/health', (_req, res) => res.json({ ok: true }))
router.get('/', (_req, res) => res.json({ ok: true, root: true }))

// 퍼블릭
router.use('/auth', authRouter)
router.use('/comments', commentRouter)
router.use('/replies', replyRouter)

// 어드민 네임스페이스
router.use('/admin', adminRouter) // 최종 경로: /admin/users, /admin/users/:id ...

export default router
