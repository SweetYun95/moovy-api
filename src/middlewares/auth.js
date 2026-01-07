// moovy-api/src/middlewares/auth.js
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { parseBearer, toUnifiedUser, getExistingUser } from '../utils/authUtils.js'

dotenv.config()

function isDevBypassEnabled() {
   return String(process.env.NODE_ENV || '').toLowerCase() === 'development'
}

function ensureDevUser(req, kind = 'user') {
   if (!req) return
   const pre = getExistingUser(req)
   if (pre) {
      if (!req.user) req.user = pre
      if (!req.authUser) req.authUser = pre
      return
   }

   const u =
      kind === 'admin'
         ? {
              id: 1,
              user_id: 1,
              admin_id: 1,
              role: 'SUPERADMIN',
              name: 'dev-admin',
              email: 'dev-admin@local',
           }
         : {
              id: 1,
              user_id: 1,
              role: 'USER',
              name: 'dev-user',
              email: 'dev-user@local',
           }

   req.user = u
   req.authUser = u
}

/**
 * requireAuth
 * - 인증 필수: (1) 세션/패스포트 or (2) 선행 토큰 주입 or (3) 여기서 JWT 검증
 * - 성공 시 req.user, req.authUser를 통합 형태로 세팅
 * - 실패 시 401/419
 */
export function requireAuth(req, res, next) {
   try {
      if (isDevBypassEnabled()) {
         ensureDevUser(req, 'user')
         return next()
      }

      // 1) 세션/선행 주입 확인
      const pre = getExistingUser(req)
      if (pre) {
         if (!req.user) req.user = pre
         if (!req.authUser) req.authUser = pre
         return next()
      }

      // 2) 직접 토큰 파싱/검증
      const raw = req.headers.authorization || req.get('Authorization') || ''
      const token = parseBearer(raw)
      if (!token) {
         return res.status(401).json({ message: '인증 토큰이 필요합니다.' })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const u = toUnifiedUser(decoded)

      req.decoded = decoded
      req.authUser = u
      req.user = u
      return next()
   } catch (error) {
      if (error.name === 'TokenExpiredError') {
         return res.status(419).json({ message: '토큰이 만료되었습니다.' })
      }
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' })
   }
}

/**
 * optionalAuth
 * - 인증이 있으면 주입, 없어도 통과
 * - 공개 라우트에서 사용자 컨텍스트가 필요할 수 있을 때 사용
 */
export function optionalAuth(req, _res, next) {
   try {
      if (isDevBypassEnabled()) {
         // 공개 라우트는 인증 없어도 되지만, 개발 편의상 컨텍스트가 필요한 경우를 대비해 주입
         ensureDevUser(req, 'user')
         return next()
      }

      const pre = getExistingUser(req)
      if (pre) {
         if (!req.user) req.user = pre
         if (!req.authUser) req.authUser = pre
         return next()
      }

      const raw = req.headers.authorization || req.get('Authorization') || ''
      const token = parseBearer(raw)
      if (!token) return next()

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const u = toUnifiedUser(decoded)

      req.decoded = decoded
      req.authUser = u
      req.user = u
   } catch {
      // 토큰이 이상해도 공개 라우트는 그냥 통과(익명)
   }
   next()
}
