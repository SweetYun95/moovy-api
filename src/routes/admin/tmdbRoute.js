// moovy-api/src/routes/admin/tmdbRoute.js
import { Router } from 'express'
import { requireRole } from '../../middlewares/middlewares.js'
import * as tmdbController from '../../controllers/admin/tmdbController.js'

const router = Router()

// ✅ ADMIN/SUPERADMIN만 접근
router.use(requireRole(['ADMIN', 'SUPERADMIN']))

/**
 * GET /api/admin/tmdb/search
 * Query:
 * - q (string, required): 검색어
 * - page (number, optional): 페이지 (기본 1)
 */
router.get('/search', tmdbController.searchMovies)

/**
 * GET /api/admin/tmdb/movies/:tmdb_id
 * Params:
 * - tmdb_id (number, required): TMDB 영화 ID
 */
router.get('/movies/:tmdb_id', tmdbController.getMovieDetail)

export default router
