// moovy-api/src/routes/qnaRoute.js

import { Router } from 'express'

import { validate } from '../validations/validators/validate.js'
import * as ctrl from '../controllers/qnaController.js'
import { deleteQnaSchema, getListSchema, getQnaSchema, qnaPostSchema } from '../validations/schemas/qnaSchema.js'
import { isLoggedIn } from '../middlewares/middlewares.js'
import { uploadQna } from '../middlewares/upload.js'

const router = Router()

// 0) 로그인 체크
router.use(isLoggedIn)

// ─────────────────────────────
// 1) QNA 작성
// ─────────────────────────────
router.post('/', uploadQna.array('images', 5), validate({ body: qnaPostSchema }), ctrl.post)

// ─────────────────────────────
// 2) 특정 QNA 가져오기
// ─────────────────────────────
router.get('/:qna_id', validate({ params: getQnaSchema }), ctrl.getQna)

// ─────────────────────────────
// 3) 내 QNA 리스트 가져오기
// ─────────────────────────────
router.get('/list', validate({ query: getListSchema }), ctrl.getList)

// ─────────────────────────────
// 4) QNA 취소(삭제)
// ─────────────────────────────
router.delete('/:qna_id', validate({ params: deleteQnaSchema }), ctrl.deleteQna)

export default router
