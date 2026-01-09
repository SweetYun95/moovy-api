// moovy-api/src/services/admin/qnaService.js

import { Op, Sequelize } from 'sequelize'

import db from '../../models/index.js'
const { Qna, QnaImage, User, AdminUser } = db

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
   qna.state = 'FULFILLED'
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
export const getList = async (page = 1, limit = 10, filters = {}) => {
   const safePage = Math.max(1, Number(page))
   const safeLimit = Math.min(50, Number(limit))
   const offset = (safePage - 1) * safeLimit

   const where = {}
   if (filters.user_id) where.user_id = Number(filters.user_id)
   if (filters.state) where.state = filters.state
   if (filters.q_title) where.q_title = { [Op.like]: `%${filters.q_title}%` }

   if (filters.created_start || filters.created_end) {
      const start = filters.created_start || filters.created_end
      const end = filters.created_end || filters.created_start
      const startAt = new Date(`${start}T00:00:00.000`)
      const endAt = new Date(`${end}T23:59:59.999`)
      where.createdAt = { [Op.between]: [startAt, endAt] }
   }

   if (filters.answered_start || filters.answered_end) {
      const start = filters.answered_start || filters.answered_end
      const end = filters.answered_end || filters.answered_start
      const startAt = new Date(`${start}T00:00:00.000`)
      const endAt = new Date(`${end}T23:59:59.999`)
      where.updatedAt = { [Op.between]: [startAt, endAt] }
      if (!filters.state) where.state = 'FULFILLED'
   }

   const userWhere = {}
   if (filters.nickname) userWhere.name = { [Op.like]: `%${filters.nickname}%` }

   const { count, rows: qnas } = await Qna.findAndCountAll({
      where,
      include: [
         {
            model: User,
            attributes: ['user_id', 'name', 'profile_img'],
            required: Object.keys(userWhere).length > 0,
            where: Object.keys(userWhere).length > 0 ? userWhere : undefined,
         },
         {
            model: AdminUser,
            attributes: ['admin_id', 'name'],
            required: false,
         },
         {
            model: QnaImage,
            attributes: ['image_id', 'img_url', 'order'],
            required: false,
         },
      ],
      offset,
      limit: safeLimit,
      order: [
         [Sequelize.literal("CASE WHEN `Qna`.`state` = 'PENDING' THEN 0 ELSE 1 END"), 'ASC'],
         ['createdAt', 'ASC'],
      ],
      distinct: true,
   })
   return {
      success: true,
      data: {
         pagination: {
            page: safePage,
            limit: safeLimit,
            total: count,
            totalPages: Math.ceil(count / safeLimit),
         },
         list: qnas,
      },
   }
}
