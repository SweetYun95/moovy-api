// moovy-api/src/controllers/authController.js

import * as svc from '../services/authService.js'
import { normalizeProvide } from '../validations/dto/authDto.js'
import passport from 'passport'

// ─────────────────────────────
// 로컬 회원가입
// ─────────────────────────────
export const localSignUp = async (req, res, next) => {
   try {
      const { email, password, name } = req.validated.body
      const result = await svc.signUp(email, name, password)
      res.status(201).json(result)
   } catch (error) {
      next(error)
   }
}

// ─────────────────────────────
// 로컬 로그인
// ─────────────────────────────
export const localLogIn = async (req, res, next) => {
   req.body = req.validated?.body ?? req.body
   passport.authenticate('local-user', (err, user, info) => {
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
            data: {
               user: {
                  user_id: user.user_id,
                  email: user.email,
                  name: user.name,
               },
            },
         })
      })
   })(req, res, next)
}

// ─────────────────────────────
// 로그아웃
// ─────────────────────────────
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

// ─────────────────────────────
// 로그인 여부 확인
// ─────────────────────────────
export const check = async (req, res, next) => {
   try {
      if (req.isAuthenticated()) {
         return res.json({
            success: true,
            isLoggedIn: true,
         })
      } else {
         return res.json({
            success: true,
            isLoggedIn: false,
         })
      }
   } catch (e) {
      next(e)
   }
}

// ─────────────────────────────
// 로그인중인 사용자 정보 가져오기
// ─────────────────────────────
export const getMe = async (req, res, next) => {
   try {
      const user = req.user

      // Sequelize 인스턴스를 plain object로 변환
      const userData = user.toJSON ? user.toJSON() : user

      res.json({
         success: true,
         data: {
            user: {
               ...userData,
               password: null,
            },
         },
      })
   } catch (e) {
      next(e)
   }
}

// ─────────────────────────────
// 연동 해제
// ─────────────────────────────
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

// ─────────────────────────────
// 회원 탈퇴
// ─────────────────────────────
export const withdraw = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const result = await svc.withdraw(userId)
      res.json(result)
   } catch (e) {
      next(e)
   }
}

// ─────────────────────────────
// ✅ 비밀번호 재설정 요청(메일 발송)
// - authRoute.js: ctrl.passwordResetRequest
// - validated.body: { email } or { email, ... } (schema에 맞춤)
// ─────────────────────────────
export const passwordResetRequest = async (req, res, next) => {
   try {
      const body = req.validated?.body ?? req.body

      // 스키마에 뭐가 들어있든 이메일만은 보통 핵심
      const email = body.email

      if (!email) {
         const err = new Error('email is required')
         err.status = 400
         throw err
      }

      // 서비스 함수명이 팀마다 다를 수 있어서 "존재하는 것"을 우선 호출
      const fn = svc.passwordResetRequest ?? svc.requestPasswordReset ?? svc.sendPasswordResetEmail ?? svc.createPasswordResetToken

      if (typeof fn !== 'function') {
         const err = new Error('Password reset service function is not implemented (authService.js)')
         err.status = 500
         throw err
      }

      // 서비스에 필요한 인자가 더 있으면 body 전체를 넘겨도 됨
      const result = await fn(email, body)

      return res.status(200).json(
         result ?? {
            success: true,
            message: 'Password reset email sent (if the account exists).',
         }
      )
   } catch (e) {
      next(e)
   }
}

// ─────────────────────────────
// ✅ 비밀번호 재설정 확정(토큰 + 새 비번)
// - authRoute.js: ctrl.passwordResetConfirm
// - validated.body: { token, password } (schema에 맞춤)
// ─────────────────────────────
export const passwordResetConfirm = async (req, res, next) => {
   try {
      const body = req.validated?.body ?? req.body
      const { token, password } = body

      if (!token || !password) {
         const err = new Error('token and password are required')
         err.status = 400
         throw err
      }

      const fn = svc.passwordResetConfirm ?? svc.confirmPasswordReset ?? svc.resetPasswordWithToken ?? svc.updatePasswordByResetToken

      if (typeof fn !== 'function') {
         const err = new Error('Password reset confirm service function is not implemented (authService.js)')
         err.status = 500
         throw err
      }

      const result = await fn(token, password, body)

      return res.status(200).json(
         result ?? {
            success: true,
            message: 'Password has been reset successfully.',
         }
      )
   } catch (e) {
      next(e)
   }
}
