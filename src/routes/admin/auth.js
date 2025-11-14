// moovy-api/src/routes/admin/auth.js

//관리자의 로그인을 관리
import { Router } from 'express'
import passport from 'passport'

import { validate } from '../validations/validators/validate.js'

const router = Router()

// ─────────────────────────────
// 회원가입
// ─────────────────────────────
router.post('/signUp')

// ─────────────────────────────
// 로그인
// ─────────────────────────────
router.post('/signIn')

// ─────────────────────────────
// 로그인 상태확인
// ─────────────────────────────
router.get('/check')

// ─────────────────────────────
// 계정정보 가져오기
// ─────────────────────────────
router.get('/me')

// ─────────────────────────────
// 로그아웃
// ─────────────────────────────
router.post('/logout')

// ─────────────────────────────
// 계정 삭제
// ─────────────────────────────
router.delete('/withdraw')
