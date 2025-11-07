// moovy-api/src/controllers/authController.js
import * as svc from '../services/auth.service.js'
import { normalizeProvide } from '../validations/dto/auth.dto.js'

//로컬 회원가입
export const localSignUp = async (req, res, next) => {
   try {
      const { email, password, name } = req.body
      const result = await svc.signUp(email, name, password)
      res.status(201).json(result)
   } catch (error) {
      next(error)
   }
}

//로컬 로그인
export const localLogIn = async (req, res, next) => {
   passport.authenticate('local', (err, user, info) => {
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
               id: user.id,
               email: user.email,
               name: user.name,
            },
         })
      })
   })(req, res, next)
}

//로그아웃
export const logOut = async (req, res, next) => {
   try {
      req.logout((err) => {
         if (err) return next(err)

         req.session.destroy((destroyErr) => {
            if (destroyErr) return next(destroyErr)

            res.clearCookie('connect.sid')
            res.json({ success: true })
         })
      })
   } catch (e) {
      next(e)
   }
}

//로그인중인 사용자 정보 가져오기(로그인 여부 확인)
export const getMe = async (req, res, next) => {
   try {
      if (req.isAuthenticated()) {
         res.json({
            success: true,
            isLoggedIn: false,
            data: {
               email: req.user.email,
               name: req.user.name,
               state: req.user.state,
            },
         })
      } else {
         res.json({
            success: true,
            isLoggedIn: false,
         })
      }
   } catch (e) {
      next(e)
   }
}

//연동 해제
export const socialDisconnect = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const provide = normalizeProvide(req.validated?.params ?? req.params)

      const result = await svc.socialDisconnect(userId, provide)
      res.json(result)
   } catch (e) {
      next(e)
   }
}

//회원 탈퇴
export const withdraw = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const result = await svc.withdraw(userId)
      res.json(result)
   } catch (e) {
      next(e)
   }
}
