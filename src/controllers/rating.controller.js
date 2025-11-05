// moovy-api/src/controllers/rating.controller.js
import { validationResult } from 'express-validator'
import * as ratingService from '../services/rating.service.js'

// [POST] 별점 등록/수정
export const upsertRating = async (req, res, next) => {
   try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

      const userId = req.user.user_id
      const { content_id, point } = req.body

      const result = await ratingService.upsert(userId, content_id, point)
      return res.status(result.created ? 201 : 200).json(result)
   } catch (err) {
      next(err)
   }
}

// [DELETE] 내 별점 삭제
export const deleteMyRating = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const contentId = parseInt(req.params.contentId, 10)

      const result = await ratingService.remove(userId, contentId)
      return res.json(result)
   } catch (err) {
      next(err)
   }
}

// [GET] 작품별 평점 요약
export const getRatingSummary = async (req, res, next) => {
   try {
      const contentId = parseInt(req.params.id, 10)
      const userId = req.user?.user_id
      const result = await ratingService.getSummary(contentId, userId)
      return res.json(result)
   } catch (err) {
      next(err)
   }
}
