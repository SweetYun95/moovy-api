// moovy-api/src/routes/popularRoute.js
import { Router } from 'express'
import * as popularController from '../controllers/popularController.js'

const router = Router()

// 오늘자 인기 영화
router.get('/movies/today', popularController.getTodayPopularMovies)

// 특정 날짜 인기 영화 (필요하면)
router.get('/movies/by-date', popularController.getPopularMoviesByDate)

export default router
