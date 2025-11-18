// moovy-api/src/validations/schemas/qnaSchema.js

import { z } from 'zod'

export const qnaPostSchema = z.object({
   title: z.string().trim().min(1, { message: '제목은 필수 입력값입니다.' }).max(100, { message: '제목은 최대 100자까지 가능합니다.' }),

   content: z.string().trim().min(1, { message: '내용은 필수 입력값입니다.' }).max(2000, { message: '내용은 최대 2000자까지 가능합니다.' }),

   images: z.array(z.string().trim()).max(5, { message: '이미지는 최대 5개까지 등록할 수 있습니다.' }).optional(),
})

export const getQnaSchema = z.object({
   qna_id: z.coerce.number().int().positive(),
})

export const getListSchema = z.object({
   page: z.coerce.number().int().positive().default(1),
   limit: z.coerce.number().int().max(50).default(10),
})

export const deleteQnaSchema = z.object({
   qna_id: z.coerce.number().int().positive(),
})
