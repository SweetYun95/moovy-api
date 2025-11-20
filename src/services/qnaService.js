// moovy-api/src/services/qnaService.js

import fs from 'fs'
import path from 'path'

import db from '../models/index.js'
const { Qna, QnaImage } = db

// 1) QNA 작성
export const post = async (userId, title, content, files) => {
   //1. 본문 저장
   const qna = await Qna.create({
      user_id: userId,
      title,
      content,
   })

   //2. 이미지가 있다면 이미지 저장
   if (files && files.length > 0) {
      const imagesToInsert = files.map((file, index) => ({
         qna_id: qna.qna_id,
         img_url: `/uploads/qna/${file.filename}`,
         order: index,
      }))

      await QnaImage.bulkCreate(imagesToInsert)
   }

   return {
      success: true,
      data: {
         qna_id: qna.qna_id,
      },
   }
}

// 2) 특정 QNA 가져오기
export const getQna = async (userId, qna_id, adminId) => {
   const qna = await Qna.findByPk(qna_id)
   if (!qna) {
      const error = new Error('문의내역을 찾을 수 없습니다.')
      error.status = 400
      throw error
   }
   if (qna.user_id !== userId && !adminId) {
      const error = new Error('작성자가 일치하지 않습니다.')
      error.status = 401
      throw error
   }
   const qnaImg = await QnaImage.findAll({ where: { qna_id } })

   return {
      success: true,
      data: {
         qna,
         qnaImg,
      },
   }
}

// 3) 내 QNA 리스트 가져오기
export const getList = async (userId, page, limit) => {
   const safePage = Math.max(1, Number(page))
   const safeLimit = Math.min(50, Number(limit))
   const offset = (safePage - 1) * safeLimit

   const { rows, count } = await Qna.findAndCountAll({
      where: { user_id: userId },
      include: [
         {
            model: QnaImage,
            as: 'images',
            attributes: ['img_url', 'order'],
         },
      ],
      attributes: ['qna_id', 'q_title', 'q_contnet'],
      order: [['created_at ', 'DESC']],
      limit: safeLimit,
      offset,
   })

   return {
      success: true,
      data: {
         pagination: {
            total: count,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(count / safeLimit),
         },
         list: rows,
      },
   }
}

export const deleteQna = async (userId, qna_id, adminId = null) => {
   const qna = await Qna.findByPk(qna_id, {
      include: [
         {
            model: QnaImage,
            as: 'QnaImages',
            attributes: ['image_url'],
         },
      ],
   })
   if (!qna) {
      const error = new Error('문의내역을 찾을 수 없습니다.')
      error.status = 400
      throw error
   }
   if (qna.user_id !== userId && !adminId) {
      const error = new Error('작성자가 일치하지 않습니다.')
      error.status = 403
      throw error
   }

   // 1) 이미지 파일 삭제
   if (qna.images && qna.images.length > 0) {
      for (const img of qna.images) {
         const filePath = path.resolve(`.${img.image_url}`)

         try {
            if (fs.existsSync(filePath)) {
               fs.unlinkSync(filePath)
            }
         } catch (err) {
            console.error('이미지 파일 삭제 실패:', filePath, err)
         }
      }
   }

   // 2) 이미지 DB 삭제
   await QnaImage.destroy({ where: { qna_id } })

   // 3) QNA DB 삭제
   await Qna.destroy({ where: { qna_id, user_id: userId } })

   return {
      success: true,
      data: {
         qna_id,
      },
   }
}
