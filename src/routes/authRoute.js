// moovy-api/src/routes/authRoute.js
import { Router } from 'express'
import passport from 'passport'

import { validate } from '../validations/validators/validate.js'
import * as ctrl from '../controllers/authController.js'
import { loginSchema, provideParamSchema, signUpSchema } from '../validations/schemas/authSchema.js'
import { isLoggedIn, isNotLoggedIn } from '../middlewares/middlewares.js'

// ✅ 추가: 비밀번호 재설정 validation + rate limit
import { passwordResetLimiter } from '../middlewares/rateLimit.js'
import { passwordResetRequestSchema, passwordResetConfirmSchema } from '../validations/schemas/passwordResetSchema.js'

const router = Router()

// ─────────────────────────────
// 로컬 로그인/회원가입
// ─────────────────────────────

// 회원가입
router.post('/signup', isNotLoggedIn, validate({ body: signUpSchema }), ctrl.localSignUp)

// 로그인
router.post('/login', isNotLoggedIn, validate({ body: loginSchema }), ctrl.localLogIn)

// ─────────────────────────────
// 비밀번호 재설정 (로그인 불필요)
// ─────────────────────────────

// 비밀번호 재설정 요청(메일 발송)
router.post('/password/reset-request', passwordResetLimiter, validate({ body: passwordResetRequestSchema }), ctrl.passwordResetRequest)

// 비밀번호 재설정 확정(토큰 + 새 비번)
router.post('/password/reset', validate({ body: passwordResetConfirmSchema }), ctrl.passwordResetConfirm)

// ─────────────────────────────
// 카카오 로그인/회원가입
// ─────────────────────────────

router.get('/kakao', passport.authenticate('kakao'))

router.get(
   '/kakao/callback',
   passport.authenticate('kakao', {
      failureRedirect: `${process.env.FRONTEND_APP_URL}/login`, // 프론트엔드 로그인 페이지
   }),
   (req, res) => {
      res.redirect(`${process.env.FRONTEND_APP_URL}/oauth/success`) // 프론트엔드 성공 페이지
   }
)

// ─────────────────────────────
// 구글 로그인/회원가입
// ─────────────────────────────
router.get(
   '/google',
   passport.authenticate('google', {
      scope: ['profile', 'email'],
   })
)

router.get(
   '/google/callback',
   passport.authenticate('google', {
      failureRedirect: `${process.env.FRONTEND_APP_URL}/login`,
   }),
   (req, res) => {
      // 로그인 성공 - 프론트엔드로 리다이렉트
      res.redirect(`${process.env.FRONTEND_APP_URL}/oauth/success`)
   }
)

// ─────────────────────────────
// 로그아웃
// ─────────────────────────────
router.post('/logout', isLoggedIn, ctrl.logOut)

// ─────────────────────────────
// 로그인 여부 확인
// ─────────────────────────────
router.get('/check', ctrl.check)

// ─────────────────────────────
// 로그인중인 사용자 정보 가져오기
// ─────────────────────────────
router.get('/me', isLoggedIn, ctrl.getMe)

// ─────────────────────────────
// 연동 해제
// ─────────────────────────────
router.delete('/disconnect/:provide', isLoggedIn, validate({ params: provideParamSchema }), ctrl.socialDisconnect)

// ─────────────────────────────
// 회원 탈퇴
// ─────────────────────────────
router.delete('/withdraw', isLoggedIn, ctrl.withdraw)

export default router
