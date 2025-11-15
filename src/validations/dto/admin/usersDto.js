// moovy-api/src/validations/dto/admin/usersDto.js
// JS 환경에서 zod 스키마 타입을 문서화(JSDoc)로 노출하고 싶을 때.
// TS 프로젝트면 .ts로 전환해서 z.infer<> 를 직접 export 하면 됨.

import { z } from 'zod'
import {
  listUsersQuerySchema,
  userIdParamSchema,
  sanctionIdParamSchema,
  createSanctionBodySchema,
  updateSanctionBodySchema,
  forceWithdrawalBodySchema,
} from '../../schemas/admin/userSchemas.js'

/** @typedef {z.infer<typeof listUsersQuerySchema>} ListUsersQueryDTO */
/** @typedef {z.infer<typeof userIdParamSchema>} UserIdParamDTO */
/** @typedef {z.infer<typeof sanctionIdParamSchema>} SanctionIdParamDTO */
/** @typedef {z.infer<typeof createSanctionBodySchema>} CreateSanctionBodyDTO */
/** @typedef {z.infer<typeof updateSanctionBodySchema>} UpdateSanctionBodyDTO */
/** @typedef {z.infer<typeof forceWithdrawalBodySchema>} ForceWithdrawalBodyDTO */

// 필요 시 명시적 export (실제 값이 없어도 import 경로 정리를 위해 빈 객체 export)
export default {}
