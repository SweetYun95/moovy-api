// moovy-api/src/controllers/likeController.js
import * as svc from '../services/likeService.js'
import { LIKE_ERROR } from '../constants/likeConstants.js'
import { normalizeCommentId, normalizeReplyId } from '../validations/dto/likeDto.js'

/* =========================
 * Comment Like
 * ========================= */

export const toggleCommentLike = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const commentId = normalizeCommentId(req.validated.params)

      const result = await svc.toggleCommentLike({ userId, commentId })
      if (result.reason === LIKE_ERROR.TARGET_NOT_FOUND) {
         return res.status(404).json({ message: result.reason })
      }

      res.json({ liked: result.liked })
   } catch (e) {
      next(e)
   }
}

export const getCommentLikeCount = async (req, res, next) => {
   try {
      const commentId = normalizeCommentId(req.validated.params)
      const count = await svc.countCommentLike(commentId)
      res.json({ count })
   } catch (e) {
      next(e)
   }
}

export const checkCommentLike = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const commentId = normalizeCommentId(req.validated.params)
      const liked = await svc.checkCommentLike({ userId, commentId })
      res.json({ liked })
   } catch (e) {
      next(e)
   }
}

/* =========================
 * Reply Like
 * ========================= */

export const toggleReplyLike = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const replyId = normalizeReplyId(req.validated.params)

      const result = await svc.toggleReplyLike({ userId, replyId })
      if (result.reason === LIKE_ERROR.TARGET_NOT_FOUND) {
         return res.status(404).json({ message: result.reason })
      }

      res.json({ liked: result.liked })
   } catch (e) {
      next(e)
   }
}

export const getReplyLikeCount = async (req, res, next) => {
   try {
      const replyId = normalizeReplyId(req.validated.params)
      const count = await svc.countReplyLike(replyId)
      res.json({ count })
   } catch (e) {
      next(e)
   }
}

export const checkReplyLike = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const replyId = normalizeReplyId(req.validated.params)
      const liked = await svc.checkReplyLike({ userId, replyId })
      res.json({ liked })
   } catch (e) {
      next(e)
   }
}
