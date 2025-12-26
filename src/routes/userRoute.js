// moovy-api/src/routes/userRoute.js
import express from 'express'
import { isLoggedIn } from '../middlewares/middlewares.js'
import * as userCtrl from '../controllers/userController.js'
import { validate } from '../validations/validators/validate.js'
import { userEditSchema } from '../validations/schemas/userSchema.js'
import { uploadUserProfile } from '../middlewares/upload.js'

const router = express.Router()

// ─────────────────────────────
// 사용자 정보 조회
// ─────────────────────────────
router.get('/profile', isLoggedIn, userCtrl.getUserProfile)

// ─────────────────────────────
// 사용자 정보 수정
// ─────────────────────────────
router.put('/profile', isLoggedIn, validate({ body: userEditSchema }), userCtrl.updateUserProfile)

// ─────────────────────────────
// 프로필 이미지 변경
// ─────────────────────────────
router.put('/profile/image', isLoggedIn, uploadUserProfile.single('image'), userCtrl.updateProfileImage)

// ─────────────────────────────
// 닉네임 중복 확인
// ─────────────────────────────
router.post('/check-nickname', validate({ body: userEditSchema }), userCtrl.checkNickname)

// ─────────────────────────────
// 회원 탈퇴
// ─────────────────────────────
router.delete('/withdraw', isLoggedIn, userCtrl.withdrawUser)

export default router
