// moovy-api/src/routes/admin/qnaRoute.js

import { Router } from 'express'
import { uploadQna } from '../../middlewares/upload.js'
import { validate } from '../../validations/validators/validate.js'
import { requireAdminAuth } from '../../middlewares/middlewares.js'
import * as ctrl from '../../controllers/qnaController.js'
import * as adminCtrl from '../../controllers/admin/qnaController.js'
import { deleteQnaSchema, getListSchema, getQnaSchema } from '../../validations/schemas/qnaSchema.js'
import { qnaAnswerPostSchema } from '../../validations/schemas/admin/qnaSchemas.js'

const router = Router()

// 0) 어드민 인증 체크
router.use(requireAdminAuth)

// ─────────────────────────────
// 1) QNA 답변
// ─────────────────────────────
router.post('/', uploadQna.array('images', 5), validate({ body: qnaAnswerPostSchema }), adminCtrl.post)

// ─────────────────────────────
// 3) QNA 목록 가져오기
// ─────────────────────────────
router.get('/list', validate({ query: getListSchema }), adminCtrl.getList)

// ─────────────────────────────
// 2) 특정 QNA 가져오기
// ─────────────────────────────
router.get('/:qna_id', validate({ params: getQnaSchema }), ctrl.getQna)

// ─────────────────────────────
// 4) QNA 삭제
// ─────────────────────────────
router.delete('/:qna_id', validate({ params: deleteQnaSchema }), ctrl.deleteQna)

export default router
