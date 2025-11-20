// moovy-api/src/services/admin/qnaService.js

import db from '../../models/index.js'
const { Qna, QnaImage } = db

// 1) QNA 답변
export const post = async (adminId, qna_id, a_title, a_content, images) => {
   //1. qna 질문 가져오기
   const qna = await Qna.findByPk(qna_id)
   if (!qna) {
      const error = new Error('문의내역을 찾을 수 없습니다.')
      throw error
   }

   //2. 답변 저장
   qna.admin_id = adminId
   qna.a_title = a_title
   qna.a_content = a_content
   qna.state = 'FULFIILLED'
   await qna.save()

   //3. 이미지가 있다면 이미지 저장
   if (images && images.length > 0) {
      const imagesToInsert = images.map((file, index) => ({
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

// 3) QNA 목록 가져오기
export const getList = async (page = 1, limit = 10) => {
   const offset = (page - 1) * limit
   const { count, rows: qnas } = await Qna.findAndCountAll({
      include: [
         {
            model: QnaImage,
            as: 'qnaImages',
            attributes: ['qna_img_id', 'img_url', 'order'],
         },
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
   })
   return {
      success: true,
      data: {
         pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit),
         },
         list: qnas,
      },
   }
}
