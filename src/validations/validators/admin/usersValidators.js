// moovy-api/src/validations/validators/admin/usersValidators.js
import { validate } from '../validate.js'
import { listUsersQuerySchema, userIdParamSchema, sanctionIdParamSchema, createSanctionBodySchema, updateSanctionBodySchema, forceWithdrawalBodySchema, adminUpdateUserProfileBodySchema } from '../../schemas/admin/userSchema.js'

// 각 라우트에 바로 넣어서 쓰기 좋은 형태로 export
export const listUsersValidator = validate({ query: listUsersQuerySchema })
export const userDetailValidator = validate({ params: userIdParamSchema })

export const createSanctionValidator = validate({
   params: userIdParamSchema,
   body: createSanctionBodySchema,
})

export const updateSanctionValidator = validate({
   params: userIdParamSchema.merge(sanctionIdParamSchema),
   body: updateSanctionBodySchema,
})

export const deleteSanctionValidator = validate({
   params: userIdParamSchema.merge(sanctionIdParamSchema),
})

export const forceWithdrawalValidator = validate({
   params: userIdParamSchema,
   body: forceWithdrawalBodySchema,
})

export const adminUpdateUserProfileValidator = validate({
   params: userIdParamSchema,
   body: adminUpdateUserProfileBodySchema,
})

export const adminUserProfileImageParamsValidator = validate({
   params: userIdParamSchema,
})
