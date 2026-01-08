// moovy-api/src/validations/schemas/admin/topicPopularSchema.js
import { z } from 'zod'

export const getPopularSnapshotQuerySchema = z.object({
   source: z.string().max(30).optional(),
   date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/) // YYYY-MM-DD
      .optional(),
   limit: z.coerce.number().int().min(1).max(100).optional().default(20),
})
