// moovy-api/src/utils/passwordResetToken.js
import crypto from 'crypto'

export function generateResetToken() {
   const token = crypto.randomBytes(32).toString('hex') // 메일로 보낼 원본 토큰
   const tokenHash = crypto.createHash('sha256').update(token).digest('hex') // DB 저장용 해시
   return { token, tokenHash }
}

export function hashToken(token) {
   return crypto.createHash('sha256').update(String(token)).digest('hex')
}
