// moovy-api/src/validations/schemas/userSchema.js

import z from 'zod'

// ─────────────────────────────────────────
// 사용자 정보 수정 스키마
// ─────────────────────────────────────────
export const userEditSchema = z.object({
   name: z
      .string({
         invalid_type_error: '닉네임 형식이 잘못되었습니다.',
      })
      .min(1, '닉네임이 올바르지 않습니다.')
      .max(10, '닉네임은 10자 이내여야 합니다.')
      .regex(/^[가-힣a-zA-Z]+$/, '닉네임은 한글 또는 영어만 사용할 수 있습니다.')
      .optional(),
   email: z.email({ message: '유효한 이메일 형식이 아닙니다.' }).optional(),
})
