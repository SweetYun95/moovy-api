// moovy-api/src/routes/admin/dashboardRoute.js
import express from 'express'
import { requireAdminAuth } from '../../middlewares/middlewares.js'
import { getDashboardValidator } from '../../validations/validators/admin/dashboardValidators.js'
import * as ctrl from '../../controllers/admin/dashboardController.js'

const router = express.Router()

// GET /api/admin/dashboard?year=2025&topN=9
router.get('/', requireAdminAuth, getDashboardValidator, ctrl.getDashboard)

export default router
