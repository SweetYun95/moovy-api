// moovy-api/src/controllers/userController.js

import * as userService from '../services/userService.js'
import { getMe, withdraw } from './authController.js'

// ─────────────────────────────────────────
// 사용자 정보 조회
// ─────────────────────────────────────────
export async function getUserProfile(req, res, next) {
   return getMe(req, res, next)
}

// ─────────────────────────────────────────
// 사용자 정보 수정
// ─────────────────────────────────────────
export async function updateUserProfile(req, res, next) {
   try {
      const userId = req.user.user_id
      const { name, email } = req.validated.body
      const updatedUser = await userService.updateUserProfile(userId, { name, email })
      res.json({ success: true, data: updatedUser })
   } catch (error) {
      next(error)
   }
}

// ─────────────────────────────────────────
// 프로필 이미지 변경
// ─────────────────────────────────────────
export async function updateProfileImage(req, res, next) {
   try {
      const userId = req.user.user_id
      const imagePath = req.file ? req.file.path : null

      if (!imagePath) {
         const error = new Error('프로필 이미지가 제공되지 않았습니다.')
         error.status = 400
         throw error
      }
      const updatedUser = await userService.updateProfileImage(userId, imagePath)

      res.json({ success: true, data: updatedUser })
   } catch (error) {
      // 프로필 변경 실패시 업로드된 파일 삭제
      if (error && req.file) {
         fs.unlink(req.file.path)
      }
      next(error)
   }
}

// ─────────────────────────────────────────
// 닉네임 중복 확인
// ─────────────────────────────────────────
export async function checkNickname(req, res, next) {
   try {
      const { name } = req.validated.body
      const isAvailable = await userService.isNicknameAvailable(name)
      res.json({ success: true, data: { isAvailable } })
   } catch (error) {
      next(error)
   }
}

// ─────────────────────────────────────────
// 회원 탈퇴
// ─────────────────────────────────────────
export async function withdrawUser(req, res, next) {
   return withdraw(req, res, next)
}
