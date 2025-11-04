// moovy-api/src/routes/favorite.route.js
// todo: index.js 에 연결해야함
import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.js'
import * as ctrl from '../controllers/favorite.controller.js'
import { validate } from '../validations/validators/validate.js'
import { contentIdParamSchema, listFavoritesQuerySchema } from '../validations/schemas/favorite.schema.js'

const router = Router()

router.use(requireAuth) // 로그인 필수

// GET /api/favorites?page=&limit=
router.get('/', validate({ query: listFavoritesQuerySchema }), ctrl.listMyFavorites)

// GET /api/favorites/:contentId/check
router.get('/:contentId/check', validate({ params: contentIdParamSchema }), ctrl.checkFavorite)

// POST /api/favorites/:contentId
router.post('/:contentId', validate({ params: contentIdParamSchema }), ctrl.addFavorite)

// POST /api/favorites/:contentId/toggle
router.post('/:contentId/toggle', validate({ params: contentIdParamSchema }), ctrl.toggleFavorite)

// DELETE /api/favorites/:contentId
router.delete('/:contentId', validate({ params: contentIdParamSchema }), ctrl.removeFavorite)

export default router
