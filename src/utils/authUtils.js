// moovy-api/src/utils/authUtils.js
/**
 * Authorization 헤더에서 토큰 추출
 * "Bearer xxx" → "xxx" (접두사 없는 순수 토큰도 허용)
 */
export function parseBearer(headerValue) {
   if (!headerValue || typeof headerValue !== 'string') return null
   const parts = headerValue.split(' ')
   if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1]
   if (parts.length === 1 && parts[0].length > 20) return parts[0]
   return null
}

/** JWT payload → 프로젝트 통합 유저 객체로 변환 */
export function toUnifiedUser(decoded) {
   return {
      id: decoded.id ?? decoded.user_id ?? decoded.admin_id ?? null,
      user_id: decoded.user_id ?? null,
      admin_id: decoded.admin_id ?? null,
      role: decoded.role ?? null,
      provider: decoded.provider ?? null,
      email: decoded.email ?? null,
      name: decoded.name ?? null,
   }
}

/** 세션/패스포트 or hydrateAuthFromToken 결과에서 유저 추출 */
export function getExistingUser(req) {
   if (req.isAuthenticated && req.isAuthenticated() && req.user) return req.user
   if (req.authUser) return req.authUser
   return null
}
