// moovy-api/src/routes/admin/reportsRoute.js

import { Router } from 'express'
import { requireAdminAuth } from '../../middlewares/middlewares.js'
import { validate } from '../../validations/validators/validate.js'
import * as ctrl from '../../controllers/admin/reportsController.js'
import { adminReportCompleteQuerySchema, adminReportDetailSchema, adminReportListSchema } from '../../validations/schemas/admin/reportSchema.js'

const router = Router()

router.use(requireAdminAuth)

// GET /api/admin/reports/list
router.get('/list', validate({ query: adminReportListSchema }), ctrl.getList)

// GET /api/admin/reports/:type/:report_id
router.get('/:type/:report_id', validate({ params: adminReportDetailSchema }), ctrl.getDetail)

// DELETE /api/admin/reports/:type/:report_id (soft delete => 처리완료)
router.delete('/:type/:report_id', validate({ params: adminReportDetailSchema, query: adminReportCompleteQuerySchema }), ctrl.complete)

export default router
