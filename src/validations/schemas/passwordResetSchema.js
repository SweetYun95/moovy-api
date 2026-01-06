// moovy-api/src/validations/schemas/passwordResetSchema.js
import { z } from 'zod'

export const passwordResetRequestSchema = z.object({
    email: z.string().email({ message: '유효한 이메일 형식이 아닙니다.' }),
})

export const passwordResetConfirmSchema = z.object({
   token: z.string({ invalid_type_error: '토큰 형식이 잘못되었습니다.' }).min(8, '토큰이 올바르지 않습니다.'), // 너무 짧으면 컷

   password: z
      .string({ invalid_type_error: '비밀번호 형식이 잘못되었습니다.' })
      .min(1, '비밀번호는 필수입니다.')
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(72, '비밀번호는 72자 이하로 입력하세요.')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, '비밀번호는 대문자, 소문자, 숫자를 각각 하나 이상 포함해야 합니다.'),
})
