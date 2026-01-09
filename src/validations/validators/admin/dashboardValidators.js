// moovy-api/src/validations/validators/admin/dashboardValidators.js
import { validate } from '../validate.js'
import { getDashboardQuerySchema } from '../../schemas/admin/dashboardSchema.js'

export const getDashboardValidator = validate({
   query: getDashboardQuerySchema,
})
