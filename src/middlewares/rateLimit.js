// moovy-api/src/middlewares/rateLimit.js
import rateLimit from 'express-rate-limit'

// 비밀번호 재설정 요청: 메일 폭탄/계정 수집 방지
export const passwordResetLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15분
   max: 5, // IP당 5회
   standardHeaders: true,
   legacyHeaders: false,
   message: { message: '요청이 너무 많습니다. 잠시 후 다시 시도하세요.' },
})
