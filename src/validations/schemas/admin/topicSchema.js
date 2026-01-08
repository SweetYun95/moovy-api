// moovy-api/src/validations/schemas/admin/topicSchema.js
import { z } from 'zod'
import { TOPIC_MAIN_TABS, TOPIC_FILTER_TABS, ORDER_DIRECTIONS, TOPIC_SORT_FIELDS } from '../../../constants/admin/topicConstants.js'

export const listTopicsQuerySchema = z.object({
   main: z.enum(TOPIC_MAIN_TABS).optional().default('current'),
   filter: z.enum(TOPIC_FILTER_TABS).optional().default('all'),

   page: z.coerce.number().int().min(1).optional().default(1),
   size: z.coerce.number().int().min(1).max(100).optional().default(20),

   // 기본 정렬: start_at DESC
   sort: z.enum(TOPIC_SORT_FIELDS).optional().default('start_at'),
   order: z.enum(ORDER_DIRECTIONS).optional().default('DESC'),
})

export const topicIdParamSchema = z.object({
   topic_id: z.coerce.number().int().min(1),
})

export const createTopicBodySchema = z
   .object({
      content_id: z.coerce.number().int().min(1),
      start_at: z.coerce.date(),
      end_at: z.coerce.date(),
      // ✅ 컬럼이 있으면 사용. 없으면 서비스에서 무시하도록 처리 가능
      is_admin_recommended: z.coerce.boolean().optional().default(false),
   })
   .refine((v) => v.start_at <= v.end_at, { message: 'start_at은 end_at보다 늦을 수 없습니다.' })

export const updateTopicBodySchema = z
   .object({
      start_at: z.coerce.date().optional(),
      end_at: z.coerce.date().optional(),
      is_admin_recommended: z.coerce.boolean().optional(),
   })
   .refine((v) => Object.keys(v).length > 0, { message: '수정할 값이 없습니다.' })
   .refine((v) => !(v.start_at && v.end_at) || v.start_at <= v.end_at, { message: 'start_at은 end_at보다 늦을 수 없습니다.' })

export const listTopicCommentsQuerySchema = z.object({
   page: z.coerce.number().int().min(1).optional().default(1),
   size: z.coerce.number().int().min(1).max(100).optional().default(20),
   q: z.string().optional(), // 댓글 내용 검색
   order: z.enum(ORDER_DIRECTIONS).optional().default('DESC'),
})
