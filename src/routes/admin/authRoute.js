// moovy-api/src/routes/admin/authRoute.js
import express from 'express'
import { requireAdminAuth, requireRole } from '../../middlewares/middlewares.js'
import * as validate from '../../validations/validators/admin/authValidators.js'
import * as ctrl from '../../controllers/admin/authController.js'

const router = express.Router()

// 1) 어드민 회원가입  → POST /api/admin/auth/signUp
router.post('/signUp', validate.signUpValidaotr, ctrl.signUp)

// 2) 어드민 로그인  → POST /api/admin/auth/signIn
router.post('/signIn', validate.signInValidator, ctrl.signIn)

// 2) 어드민 로그인 확인 → GET /api/admin/auth/:user_id
router.get('/check', requireRole(['ADMIN', 'SUPERADMIN']), ctrl.check)

// 3) 어드민 계정 삭제(슈퍼관리자)  → POST /api/admin/auth/:user_id/sanctions
router.delete('/delete/:user_id', requireRole(['SUPERADMIN']), validate.deleteValidator, ctrl.withdraw)

export default router
