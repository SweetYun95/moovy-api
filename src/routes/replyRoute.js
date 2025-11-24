// moovy-api/src/routes/replyRoute.js
import express from 'express'
import { isLoggedIn } from '../middlewares/middlewares.js'
import * as replyCtrl from '../controllers/replyController.js'

const router = express.Router()

// 대댓글 작성
router.post('/', isLoggedIn, replyCtrl.createReply)

// 대댓글 목록 조회 (특정 코멘트 기준, 페이지네이션)
router.get('/:comment_id', replyCtrl.getRepliesByComment)

// 대댓글 수정
router.put('/:reply_id', isLoggedIn, replyCtrl.updateReply)

// 대댓글 삭제
router.delete('/:reply_id', isLoggedIn, replyCtrl.deleteReply)

export default router
