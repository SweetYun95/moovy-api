// moovy-api/src/controllers/admin/authController.js
import * as auhtService from '../../services/admin/authService.js'

export const signUp = async (req, res, next) => {
   try {
      const result = await auhtService.signUp(req.validated?.query || req.query || {})
      res.json(result)
   } catch (e) {
      next(e)
   }
}
export const signIn = async (req, res, next) => {
   try {
      const admin_id = req.user.admin_id
   } catch (e) {
      next(e)
   }
}
export const check = async (req, res, next) => {
   try {
   } catch (e) {
      next(e)
   }
}
export const withdraw = async (req, res, next) => {
   try {
   } catch (e) {
      next(e)
   }
}
