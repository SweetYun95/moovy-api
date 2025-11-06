// moovy-api/src/validations/schemas/auth.schema.js
import { z } from 'zod'

export const provideParamSchema = z.object({
   provide: z.enum(['kakao', 'google'], {
      required_error: '소셜 제공자(provide)는 필수입니다.',
      invalid_type_error: '유효하지 않은 소셜 제공자입니다.',
   }),
})
