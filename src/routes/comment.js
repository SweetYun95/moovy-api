// moovy-api/src/routes/comment.js
import express from 'express'
import { isLoggedIn } from './middlewares.js'
import * as commentCtrl from '../controllers/commentController.js'

const router = express.Router()

// 댓글 작성
router.post('/', isLoggedIn, commentCtrl.createComment)

// 댓글 전체 조회 (특정 토픽 기준)
router.get('/:topic_id', commentCtrl.getCommentsByTopic)

// 댓글 수정
router.put('/:comment_id', isLoggedIn, commentCtrl.updateComment)

// 댓글 삭제
router.delete('/:comment_id', isLoggedIn, commentCtrl.deleteComment)

export default router
