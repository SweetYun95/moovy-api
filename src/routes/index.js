// moovy-api/src/routes/index.js
import { Router } from 'express'

// 라우터 모듈 (기본 포맷)
import authRouter from './auth.js'

const router = Router()

// 헬스 & 루트
router.get('/health', (_req, res) => res.json({ ok: true }))
router.get('/', (_req, res) => res.json({ ok: true, root: true }))

// 퍼블릭(유저) 라우터
router.use('/auth', authRouter)

// 관리자 라우터
// router.use('/api/admin', adminRouter)

export default router
