// moovy-api/src/validations/schemas/favorite.schema.js
import { z } from 'zod'

// :contentId 경로 파라미터
export const contentIdParamSchema = z.object({
   contentId: z.coerce.number().int().positive(),
})

// 리스트 조회 쿼리
export const listFavoritesQuerySchema = z.object({
   page: z.coerce.number().int().min(1).default(1),
   limit: z.coerce.number().int().min(1).max(50).default(10),
})
