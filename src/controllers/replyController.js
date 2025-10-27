// moovy-api/src/controllers/replyController.js
import { CommentReply, CommentTbl, User } from '../models/index.js'
import { Op } from 'sequelize'

/**
 * 대댓글(Reply) 작성
 * POST /api/replies
 * body: { comment_id, content }
 */
export const createReply = async (req, res) => {
   try {
      const { comment_id, content } = req.body
      const user_id = req.user?.user_id

      if (!comment_id || !content) return res.status(400).json({ message: 'comment_id와 content는 필수입니다.' })

      // 상위 코멘트 존재 확인
      const parent = await CommentTbl.findByPk(comment_id)
      if (!parent) return res.status(404).json({ message: '상위 코멘트가 존재하지 않습니다.' })

      const reply = await CommentReply.create({
         comment_id,
         user_id,
         content,
      })

      // 작성자 정보 포함해서 반환
      const withAuthor = await CommentReply.findByPk(reply.reply_id, {
         include: [{ model: User, attributes: ['user_id', 'name'] }],
      })

      return res.status(201).json(withAuthor)
   } catch (err) {
      console.error(err)
      return res.status(500).json({ message: '대댓글 작성 실패', error: err.message })
   }
}

/**
 * 대댓글 목록 조회
 * GET /api/replies/:comment_id?page=1&size=20
 */
export const getRepliesByComment = async (req, res) => {
   try {
      const { comment_id } = req.params
      const page = parseInt(req.query.page ?? '1', 10)
      const size = Math.min(parseInt(req.query.size ?? '20', 10), 100)
      const offset = (page - 1) * size

      const exists = await CommentTbl.findByPk(comment_id)
      if (!exists) return res.status(404).json({ message: '상위 코멘트가 존재하지 않습니다.' })

      const { rows, count } = await CommentReply.findAndCountAll({
         where: { comment_id },
         include: [{ model: User, attributes: ['user_id', 'name'] }],
         order: [['created_at', 'ASC']],
         limit: size,
         offset,
      })

      return res.json({
         items: rows,
         meta: {
            page,
            size,
            total: count,
            totalPages: Math.ceil(count / size),
         },
      })
   } catch (err) {
      console.error(err)
      return res.status(500).json({ message: '대댓글 조회 실패', error: err.message })
   }
}

/**
 * 대댓글 수정
 * PUT /api/replies/:reply_id
 * body: { content }
 */
export const updateReply = async (req, res) => {
   try {
      const { reply_id } = req.params
      const { content } = req.body
      const user_id = req.user?.user_id

      const reply = await CommentReply.findByPk(reply_id)
      if (!reply) return res.status(404).json({ message: '대댓글이 존재하지 않습니다.' })

      if (reply.user_id !== user_id) return res.status(403).json({ message: '본인의 대댓글만 수정할 수 있습니다.' })

      await reply.update({ content })
      return res.json({ message: '수정 완료', reply })
   } catch (err) {
      console.error(err)
      return res.status(500).json({ message: '대댓글 수정 실패', error: err.message })
   }
}

/**
 * 대댓글 삭제
 * DELETE /api/replies/:reply_id
 */
export const deleteReply = async (req, res) => {
   try {
      const { reply_id } = req.params
      const user_id = req.user?.user_id

      const reply = await CommentReply.findByPk(reply_id)
      if (!reply) return res.status(404).json({ message: '대댓글이 존재하지 않습니다.' })

      if (reply.user_id !== user_id) return res.status(403).json({ message: '본인의 대댓글만 삭제할 수 있습니다.' })

      await reply.destroy() // paranoid: true → soft delete
      return res.json({ message: '삭제 완료' })
   } catch (err) {
      console.error(err)
      return res.status(500).json({ message: '대댓글 삭제 실패', error: err.message })
   }
}
