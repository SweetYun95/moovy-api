// moovy-api/src/validations/schemas/admin/dashboardSchema.js
import { z } from 'zod'

export const getDashboardQuerySchema = z.object({
   year: z.coerce.number().int().min(2000).max(2100).optional(),
   topN: z.coerce.number().int().min(1).max(50).optional(),
})
