// moovy-api/src/routes/admin/historyRoute.js
import { Router } from 'express'
import * as historyController from '../../controllers/admin/historyController.js'

const router = Router()

/**
 * GET /admin/histories
 * query: page, limit, action, user_id, admin_id, created_start, created_end
 */
router.get('/', historyController.getList)

export default router
