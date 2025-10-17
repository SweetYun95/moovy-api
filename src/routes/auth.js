// moovy-api/src/routes/auth.js
import { Router } from 'express'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import db from '../models/index.js'

const router = Router()

// 회원가입 (스텁)
router.post('/join', (_req, res) => {
   // TODO: 유효성 검사 → 중복 체크 → hash → 생성
   return res.status(501).json({ success: false, message: 'Not Implemented: /auth/join' })
})

// 로그인 (스텁)
router.post('/login', (_req, res) => {
   // TODO: 사용자 조회 → 비밀번호 비교 → JWT 발급 or 세션
   return res.status(501).json({ success: false, message: 'Not Implemented: /auth/login' })
})

// 상태 확인 (스텁)
router.get('/status', (_req, res) => {
   // TODO: 세션/토큰 검증 후 상태 반환
   return res.json({ isAuthenticated: false })
})

// 내 정보 (스텁)
router.get('/me', (_req, res) => {
   // TODO: 인증 미들웨어 연동 후 유저 정보 반환
   return res.status(401).json({ user: null })
})

export default router
