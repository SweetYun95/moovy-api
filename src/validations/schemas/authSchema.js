// moovy-api/src/validations/schemas/authSchema.js
import { z } from 'zod'

export const signUpSchema = z.object({
   email: z.email({ message: '유효한 이메일 형식이 아닙니다.' }),
   password: z
      .string({
         invalid_type_error: '비밀번호 형식이 잘못되었습니다.',
      })
      .min(1, '비밀번호는 필수입니다.')
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(72, '비밀번호는 72자 이하로 입력하세요.') // bcrypt 한계 고려
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, '비밀번호는 대문자, 소문자, 숫자를 각각 하나 이상 포함해야 합니다.')
      .optional()
      .superRefine((val, ctx) => {
         if (val === undefined) {
            ctx.addIssue({
               code: 'custom',
               message: '비밀번호는 필수입니다.',
            })
         }
      }),

   name: z
      .string({
         invalid_type_error: '닉네임 형식이 잘못되었습니다.',
      })
      .min(1, '닉네임은 필수입니다.')
      .max(10, '닉네임은 10자 이내여야 합니다.')
      .regex(/^[가-힣a-zA-Z]+$/, '닉네임은 한글 또는 영어만 사용할 수 있습니다.')
      .optional()
      .superRefine((val, ctx) => {
         if (val === undefined) {
            ctx.addIssue({
               code: 'custom',
               message: '닉네임은 필수입니다.',
            })
         }
      }),
})

export const loginSchema = z.object({
   email: z.email({ message: '유효한 이메일 형식이 아닙니다.' }),
   password: z.string().min(1, '비밀번호는 필수입니다.'),
})

export const provideParamSchema = z.object({
   provide: z.enum(['kakao', 'google'], {
      required_error: '소셜 제공자(provide)는 필수입니다.',
      invalid_type_error: '유효하지 않은 소셜 제공자입니다.',
   }),
})

export const checkEmailSchema = z.object({
   email: z.email({ message: '유효한 이메일 형식이 아닙니다.' }),
})
