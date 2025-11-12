// moovy-api/src/controllers/admin/usersController.js
import * as usersService from '../../services/admin/usersService.js'

// 목록
export const list = async (req, res, next) => {
   try {
      const data = await usersService.listUsers(req.validated?.query || req.query || {})
      res.json(data)
   } catch (e) {
      next(e)
   }
}

// 상세
export const detail = async (req, res, next) => {
   try {
      const { user_id } = req.validated?.params || req.params
      const user = await usersService.getUserDetail(user_id)
      if (!user) return res.status(404).json({ message: 'User not found' })
      res.json(user)
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
      res.status(201).json({ message: 'Sanction created', sanction })
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
      res.json({ message: 'Sanction updated', sanction })
   } catch (e) {
      next(e)
   }
}

// 제재 삭제
export const deleteSanction = async (req, res, next) => {
   try {
      const { user_id, id } = req.validated?.params || req.params
      await usersService.deleteSanction({ user_id, id })
      res.json({ message: 'Sanction deleted' })
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
      res.json({ message: 'User forcibly withdrawn' })
   } catch (e) {
      next(e)
   }
}
