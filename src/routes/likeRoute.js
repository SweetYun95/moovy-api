// moovy-api/src/routes/likeRoute.js
import { Router } from 'express'
import { requireAuth, optionalAuth } from '../middlewares/auth.js'
import { validate } from '../validations/validators/validate.js'
import { commentIdParamSchema, replyIdParamSchema } from '../validations/schemas/likeSchema.js'
import * as ctrl from '../controllers/likeController.js'

const router = Router()

/* =========================
 * Comment Like
 * ========================= */

router.post('/comments/:comment_id/toggle', requireAuth, validate({ params: commentIdParamSchema }), ctrl.toggleCommentLike)

router.get('/comments/:comment_id/count', validate({ params: commentIdParamSchema }), ctrl.getCommentLikeCount)

router.get('/comments/:comment_id/check', requireAuth, validate({ params: commentIdParamSchema }), ctrl.checkCommentLike)

/* =========================
 * Reply Like
 * ========================= */

router.post('/replies/:reply_id/toggle', requireAuth, validate({ params: replyIdParamSchema }), ctrl.toggleReplyLike)

router.get('/replies/:reply_id/count', validate({ params: replyIdParamSchema }), ctrl.getReplyLikeCount)

router.get('/replies/:reply_id/check', requireAuth, validate({ params: replyIdParamSchema }), ctrl.checkReplyLike)

export default router
