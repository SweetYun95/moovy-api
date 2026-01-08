// moovy-api/src/validations/schemas/admin/reportSchema.js

import { z } from 'zod'

export const adminReportListSchema = z.object({
   page: z.coerce.number().int().positive().default(1),
   limit: z.coerce.number().int().positive().max(50).default(10),

   reporter: z.string().trim().min(1).optional(),
   reported: z.string().trim().min(1).optional(),

   post_type: z.enum(['comment', 'reply']).optional(),
   post_id: z.coerce.number().int().positive().optional(),

   report_type: z.enum(['OTHER', 'SPAM', 'SPOILER', 'ABUSE', 'HARASSMENT']).optional(),

   created_start: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
   created_end: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),

   status: z.enum(['PENDING', 'COMPLETED']).optional(),
})

export const adminReportDetailSchema = z.object({
   type: z.enum(['comment', 'reply']),
   report_id: z.coerce.number().int().positive(),
})

export const adminReportCompleteQuerySchema = z.object({
   action: z.enum(['NONE', 'SANCTION']).optional(),
})
