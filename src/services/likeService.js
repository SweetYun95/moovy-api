// moovy-api/src/services/likeService.js
import db from '../models/index.js'
import { LIKE_ERROR } from '../constants/likeConstants.js'

const { CommentLike, ReplyLike, CommentTbl, CommentReply } = db

/* =========================
 * Comment Like
 * ========================= */

export async function toggleCommentLike({ userId, commentId }) {
   const target = await CommentTbl.findByPk(commentId)
   if (!target) return { ok: false, reason: LIKE_ERROR.TARGET_NOT_FOUND }

   const existed = await CommentLike.findOne({
      where: { user_id: userId, comment_id: commentId },
   })

   if (existed) {
      await existed.destroy()
      return { liked: false }
   }

   await CommentLike.create({ user_id: userId, comment_id: commentId })
   return { liked: true }
}

export async function countCommentLike(commentId) {
   return CommentLike.count({ where: { comment_id: commentId } })
}

export async function checkCommentLike({ userId, commentId }) {
   const found = await CommentLike.findOne({
      where: { user_id: userId, comment_id: commentId },
   })
   return Boolean(found)
}

/* =========================
 * Reply Like
 * ========================= */

export async function toggleReplyLike({ userId, replyId }) {
   const target = await CommentReply.findByPk(replyId)
   if (!target) return { ok: false, reason: LIKE_ERROR.TARGET_NOT_FOUND }

   const existed = await ReplyLike.findOne({
      where: { user_id: userId, reply_id: replyId },
   })

   if (existed) {
      await existed.destroy()
      return { liked: false }
   }

   await ReplyLike.create({ user_id: userId, reply_id: replyId })
   return { liked: true }
}

export async function countReplyLike(replyId) {
   return ReplyLike.count({ where: { reply_id: replyId } })
}

export async function checkReplyLike({ userId, replyId }) {
   const found = await ReplyLike.findOne({
      where: { user_id: userId, reply_id: replyId },
   })
   return Boolean(found)
}
