// moovy-api/src/validations/validators/passwordResetValidator.js
import { validate } from './validate.js'
import { passwordResetRequestSchema, passwordResetConfirmSchema } from '../schemas/passwordResetSchema.js'

export const passwordResetRequestValidator = validate({
   body: passwordResetRequestSchema,
})

export const passwordResetConfirmValidator = validate({
   body: passwordResetConfirmSchema,
})
