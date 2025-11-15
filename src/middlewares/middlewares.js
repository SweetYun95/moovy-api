// moovy-api/src/middlewares/middlewares.js
import jwt from 'jsonwebtoken'
import { parseBearer, toUnifiedUser, getExistingUser } from '../utils/authUtils.js'

/** 전역 선행 미들웨어: Authorization 헤더가 있으면 JWT를 검증해 req.authUser에 주입 */
export function hydrateAuthFromToken(req, _res, next) {
   try {
      const raw = req.headers.authorization || req.get('Authorization') || ''
      const token = parseBearer(raw)
      if (!token) return next()

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.decoded = decoded
      req.authUser = toUnifiedUser(decoded)
      return next()
   } catch {
      // 토큰이 있지만 유효하지 않은 경우: 여기서 바로 차단하지 않고 보호 미들웨어에서 판단
      return next()
   }
}

/** 로그인 필요(세션 || 유효 JWT) */
export function isLoggedIn(req, _res, next) {
   const me = getExistingUser(req)
   if (me) return next()
   const error = new Error('로그인이 필요합니다.')
   error.status = 403
   return next(error)
}

/** 비로그인만 허용 */
export function isNotLoggedIn(req, _res, next) {
   const me = getExistingUser(req)
   if (!me) return next()
   const error = new Error('이미 로그인 상태입니다.')
   error.status = 400
   return next(error)
}

/** 순수 JWT만 강제하고 싶을 때 (세션 무시) */
export function verifyToken(req, _res, next) {
   try {
      const raw = req.headers.authorization || req.get('Authorization') || ''
      const token = parseBearer(raw)
      if (!token) {
         const error = new Error('인증 토큰이 필요합니다.')
         error.status = 401
         return next(error)
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.decoded = decoded
      req.authUser = toUnifiedUser(decoded)
      return next()
   } catch (error) {
      if (error.name === 'TokenExpiredError') {
         error.status = 419
         error.message = '토큰이 만료되었습니다.'
         return next(error)
      }
      error.status = 401
      error.message = '유효하지 않은 토큰입니다.'
      return next(error)
   }
}

/** 관리자 전용 보호(세션 || 토큰) */
export function requireAdminAuth(req, _res, next) {
   const me = getExistingUser(req)
   if (!me) {
      const error = new Error('로그인이 필요합니다.')
      error.status = 403
      return next(error)
   }
   // 관리자 인증: admin_id 존재 또는 role이 ADMIN/SUPERADMIN
   const role = String(me.role || '').toUpperCase()
   if (me.admin_id || role === 'ADMIN' || role === 'SUPERADMIN') return next()

   const error = new Error('관리자 권한이 필요합니다.')
   error.status = 403
   return next(error)
}

/** 역할 제한자: requireRole(['ADMIN','SUPERADMIN']) */
export function requireRole(roles = []) {
   const allow = roles.map((r) => String(r).toUpperCase())
   return (req, _res, next) => {
      const me = getExistingUser(req)
      if (!me) {
         const error = new Error('로그인이 필요합니다.')
         error.status = 403
         return next(error)
      }
      const role = String(me.role || '').toUpperCase()
      if (allow.includes(role)) return next()

      const error = new Error('권한이 없습니다.')
      error.status = 403
      return next(error)
   }
}

/** 컨트롤러 헬퍼: 인증된 사용자 id */
export function getAuthUserId(req) {
   const me = (req && (req.user || req.authUser)) || null
   return me?.id || null
}
