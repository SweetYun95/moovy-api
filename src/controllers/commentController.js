// moovy-api/src/controllers/commentController.js
import { CommentTbl, User, Topic } from '../models/index.js'

// 코멘트 작성
export const createComment = async (req, res) => {
   try {
      const { topic_id, content } = req.body
      const user_id = req.user.user_id // 로그인 유저 정보

      if (!topic_id || !content) return res.status(400).json({ message: 'topic_id와 content는 필수입니다.' })

      const topic = await Topic.findByPk(topic_id)
      if (!topic) return res.status(404).json({ message: '존재하지 않는 토픽입니다.' })

      const newComment = await CommentTbl.create({
         topic_id,
         user_id,
         content,
      })

      return res.status(201).json(newComment)
   } catch (err) {
      console.error(err)
      res.status(500).json({ message: '코멘트 작성 실패', error: err.message })
   }
}

// 코멘트 조회 (토픽 기준)
export const getCommentsByTopic = async (req, res) => {
   try {
      const { topic_id } = req.params

      const comments = await CommentTbl.findAll({
         where: { topic_id },
         include: [{ model: User, attributes: ['user_id', 'name'] }],
         order: [['created_at', 'DESC']],
      })

      return res.json(comments)
   } catch (err) {
      res.status(500).json({ message: '코멘트 조회 실패', error: err.message })
   }
}

// 코멘트 수정
export const updateComment = async (req, res) => {
   try {
      const { comment_id } = req.params
      const { content } = req.body
      const user_id = req.user.user_id

      const comment = await CommentTbl.findByPk(comment_id)
      if (!comment) return res.status(404).json({ message: '코멘트가 존재하지 않습니다.' })
      if (comment.user_id !== user_id) return res.status(403).json({ message: '본인의 코멘트만 수정할 수 있습니다.' })

      await comment.update({ content })
      return res.json({ message: '수정 완료', comment })
   } catch (err) {
      res.status(500).json({ message: '코멘트 수정 실패', error: err.message })
   }
}

// 코멘트 삭제
export const deleteComment = async (req, res) => {
   try {
      const { comment_id } = req.params
      const user_id = req.user.user_id

      const comment = await CommentTbl.findByPk(comment_id)
      if (!comment) return res.status(404).json({ message: '코멘트가 존재하지 않습니다.' })
      if (comment.user_id !== user_id) return res.status(403).json({ message: '본인의 코멘트만 삭제할 수 있습니다.' })

      await comment.destroy()
      return res.json({ message: '삭제 완료' })
   } catch (err) {
      res.status(500).json({ message: '코멘트 삭제 실패', error: err.message })
   }
}
