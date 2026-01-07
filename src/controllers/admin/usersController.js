// moovy-api/src/controllers/admin/usersController.js
import * as usersService from '../../services/admin/usersService.js'
import fs from 'fs/promises'

// 목록
export const list = async (req, res, next) => {
   try {
      const data = await usersService.listUsers(req.validated?.query || req.query || {})
      // success 플래그 추가, 나머지 페이징 데이터는 그대로 펼치기
      res.json({ success: true, ...data })
   } catch (e) {
      next(e)
   }
}

// 상세
export const detail = async (req, res, next) => {
   try {
      const { user_id } = req.validated?.params || req.params
      const user = await usersService.getUserDetail(user_id)

      if (!user) {
         const err = new Error('사용자를 찾을 수 없습니다.')
         err.status = 404
         throw err // → app.js 전역 에러 핸들러로 위임
      }

      res.json({
         success: true,
         user,
      })
   } catch (e) {
      next(e)
   }
}

// 제재 생성
export const createSanction = async (req, res, next) => {
   try {
      const { user_id } = req.validated?.params || req.params
      const admin_id = req.user.admin_id
      const { start_at, end_at, reason } = req.validated?.body || req.body

      const sanction = await usersService.createSanction({ user_id, admin_id, start_at, end_at, reason })
      res.status(201).json({
         success: true,
         message: '제재가 생성되었습니다.',
         sanction,
      })
   } catch (e) {
      next(e)
   }
}

// 제재 수정
export const updateSanction = async (req, res, next) => {
   try {
      const { user_id, id } = req.validated?.params || req.params
      const { reason, end_at, early_release } = req.validated?.body || req.body

      const sanction = await usersService.updateSanction({ user_id, id, reason, end_at, early_release })
      res.json({
         success: true,
         message: '제재가 수정되었습니다.',
         sanction,
      })
   } catch (e) {
      next(e)
   }
}

// 제재 삭제
export const deleteSanction = async (req, res, next) => {
   try {
      const { user_id, id } = req.validated?.params || req.params
      await usersService.deleteSanction({ user_id, id })
      res.json({
         success: true,
         message: '제재가 삭제되었습니다.',
      })
   } catch (e) {
      next(e)
   }
}

// 강제 탈퇴
export const forceWithdrawal = async (req, res, next) => {
   try {
      const { user_id } = req.validated?.params || req.params
      const admin_id = req.user.admin_id
      const { reason, confirm } = req.validated?.body || req.body

      await usersService.forceWithdrawal({ user_id, admin_id, reason, confirm })
      res.json({
         success: true,
         message: '사용자가 강제 탈퇴 처리되었습니다.',
      })
   } catch (e) {
      next(e)
   }
}

// 프로필(닉네임) 수정
export const updateProfile = async (req, res, next) => {
   try {
      const { user_id } = req.validated?.params || req.params
      const { name, email } = req.validated?.body || req.body

      const user = await usersService.updateUserProfileByAdmin({ user_id, name, email })
      res.json({ success: true, data: user })
   } catch (e) {
      next(e)
   }
}

// 프로필 이미지 업로드
export const updateProfileImage = async (req, res, next) => {
   try {
      const { user_id } = req.validated?.params || req.params
      const imagePath = req.file ? req.file.path : null

      if (!imagePath) {
         const err = new Error('프로필 이미지가 제공되지 않았습니다.')
         err.status = 400
         throw err
      }

      const user = await usersService.updateUserProfileImageByAdmin({ user_id, imagePath })
      res.json({ success: true, data: user })
   } catch (e) {
      if (e && req.file) {
         fs.unlink(req.file.path).catch(() => {})
      }
      next(e)
   }
}

// 프로필 이미지 기본값(삭제)
export const resetProfileImage = async (req, res, next) => {
   try {
      const { user_id } = req.validated?.params || req.params
      const user = await usersService.resetUserProfileImageByAdmin({ user_id })
      res.json({ success: true, data: user })
   } catch (e) {
      next(e)
   }
}
