// moovy-api/src/validations/schemas/likeSchema.js
import { z } from 'zod'

export const commentIdParamSchema = z.object({
   comment_id: z.coerce.number().int().positive(),
})

export const replyIdParamSchema = z.object({
   reply_id: z.coerce.number().int().positive(),
})
