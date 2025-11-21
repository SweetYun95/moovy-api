// moovy-api/src/controllers/admin/qnaController.js

import * as qnaService from '../../services/admin/qnaService.js'

// 1) QNA 답변
export const post = async (req, res, next) => {
   try {
      const adminId = req.user.admin_id
      const { qna_id, a_title, a_content } = req.validated.body || req.body
      const images = req.files

      const result = await qnaService.post(adminId, qna_id, a_title, a_content, images)
      res.status(201).json(result)
   } catch (error) {
      next(error)
   }
}

// 3) QNA 목록 가져오기
export const getList = async (req, res, next) => {
   try {
      const { page, limit } = req.validated.query || req.query
      const result = await qnaService.getList(page, limit)
      res.json(result)
   } catch (error) {
      next(error)
   }
}
