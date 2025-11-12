// moovy-api/src/validations/schemas/admin/userSchemas.js
import { z } from 'zod'
import { USER_STATE, PROVIDER_TYPES, USER_SORTABLE_FIELDS, ORDER_DIRECTIONS } from '../../../constants/admin/userConstants.js'

// 공통: 숫자 id 파라미터
export const userIdParamSchema = z.object({
   user_id: z.coerce.number().int().positive(),
})

export const sanctionIdParamSchema = z.object({
   id: z.coerce.number().int().positive(),
})

// 목록 조회 쿼리
export const listUsersQuerySchema = z.object({
   page: z.coerce.number().int().min(1).optional(),
   size: z.coerce.number().int().min(1).max(100).optional(),
   search: z.string().trim().optional(),
   state: z.enum(Object.values(USER_STATE)).optional(),
   provider: z.enum(PROVIDER_TYPES).optional(),
   sort: z.enum(USER_SORTABLE_FIELDS).optional(),
   order: z.enum(ORDER_DIRECTIONS).optional(),
})

// 제재 생성
export const createSanctionBodySchema = z.object({
   start_at: z.string().datetime().optional(), // ISO8601 문자열
   end_at: z.string().datetime(), // ISO8601 문자열
   reason: z.string().trim().min(2).max(2000),
})

// 제재 수정
export const updateSanctionBodySchema = z.object({
   reason: z.string().trim().min(1).max(2000).optional(),
   end_at: z.string().datetime().optional(),
   early_release: z.coerce.boolean().optional(),
})

// 강제 탈퇴
export const forceWithdrawalBodySchema = z.object({
   reason: z.string().trim().min(2).max(2000),
   confirm: z.coerce.boolean(),
})
