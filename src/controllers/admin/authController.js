// moovy-api/src/controllers/admin/authController.js
import * as auhtService from '../../services/admin/authService.js'

// 1) 어드민 회원가입
export const signUp = async (req, res, next) => {
   try {
      const { email, password, name } = req.validated?.body || req.body || {}
      const result = await auhtService.signUp(email, password, name)
      res.status(201).json(result)
   } catch (e) {
      next(e)
   }
}

// 2) 어드민 로그인
export const signIn = async (req, res, next) => {
   req.body = req.validated?.body ?? req.body
   passport.authenticate('local-admin', (err, user, info) => {
      if (err) return next(err)
      if (!user) {
         const error = new Error(info?.message)
         error.status = 401
         return next(error)
      }
      req.login(user, (err) => {
         if (err) return next(err)

         return res.json({
            success: true,
            user: {
               admin_id: user.admin_id,
               email: user.email,
               name: user.name,
            },
         })
      })
   })(req, res, next)
}

// 3) 어드민 로그인 확인
export const check = async (req, res, next) => {
   try {
      if (req.isAuthenticated()) {
         return res.json({
            success: true,
            isLoggedIn: true,
            isAdmin: true,
         })
      } else {
         return res.json({
            success: true,
            isLoggedIn: false,
            isAdmin: false,
         })
      }
   } catch (e) {
      next(e)
   }
}

// 4) 어드민 계정 삭제(슈퍼관리자)
export const withdraw = async (req, res, next) => {
   try {
      const adminId = req.user.admin_id
      const result = await auhtService.withdraw(adminId)
   } catch (e) {
      next(e)
   }
}
