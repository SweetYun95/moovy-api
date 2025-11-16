// moovy-api/src/validations/schemas/admin/authSchemas.js
import { z } from 'zod'

// 로그인: 이메일 + 비밀번호
export const signInSchema = z.object({
   email: z.email({ message: '유효한 이메일 형식이 아닙니다.' }),
   password: z.string().min(6, { message: '비밀번호는 최소 6자리 이상이어야 합니다.' }),
})

// 회원가입: 이메일 + 비밀번호 + 닉네임
export const signUpSchema = z.object({
   email: z.email({ message: '유효한 이메일 형식이 아닙니다.' }),
   password: z.string().min(6, { message: '비밀번호는 최소 6자리 이상이어야 합니다.' }),
   nickname: z.string().min(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' }).max(20, { message: '닉네임은 최대 20자까지 가능합니다.' }),
})

// 계정 삭제(탈퇴): params → accountId
export const withdrawSchema = z.object({
   accountId: z.string().min(1, { message: '계정 ID는 필수 값입니다.' }),
})
