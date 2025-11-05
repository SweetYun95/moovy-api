// moovy-api/src/routes/rating.route.js
import { Router } from 'express'
import { isLoggedIn } from './middlewares.js'
import * as ratingCtrl from '../controllers/rating.controller.js'
import { body, param } from 'express-validator'

const router = Router()

// 별점 등록 또는 수정 (업서트)
router.post('/', isLoggedIn, body('content_id').isInt({ min: 1 }), body('point').isInt({ min: 0, max: 10 }), ratingCtrl.upsertRating)

// 내 별점 삭제
router.delete('/:contentId', isLoggedIn, param('contentId').isInt({ min: 1 }), ratingCtrl.deleteMyRating)

// 특정 작품의 평점 요약(평균, 개수, 내 점수)
router.get('/contents/:id/rating', ratingCtrl.getRatingSummary)

export default router
