// moovy-api/src/controllers/qnaController.js
import * as qnaService from '../services/qnaService.js'

// 1) QNA 작성
export const post = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const { title, content } = req.validated.body
      const files = req.files

      const result = await qnaService.post(userId, title, content, files)
      res.status(201).json(result)
   } catch (e) {
      next(e)
   }
}

// 2) 특정 QNA 가져오기
export const getQna = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const { qna_id } = req.validated.params

      const result = await qnaService.getQna(userId, qna_id)
      res.json(result)
   } catch (e) {
      next(e)
   }
}

// 3) 내 QNA 리스트 가져오기
export const getList = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const { page, limit } = req.validated.query

      const result = await qnaService.getList(userId, page, limit)
      res.json(result)
   } catch (e) {
      next(e)
   }
}

export const deleteQna = async (req, res, next) => {
   try {
      const userId = req.user.user_id
      const { qna_id } = req.validated.params

      const result = await qnaService.deleteQna(userId, qna_id)
      res.json(result)
   } catch (e) {
      next(e)
   }
}
