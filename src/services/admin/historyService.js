// moovy-api/src/services/admin/historyService.js
import { Op } from 'sequelize'
import db from '../../models/index.js'

const { AdminHistory, AdminUser, User } = db

export const getList = async (page = 1, limit = 20, filters = {}) => {
   const safePage = Math.max(1, Number(page) || 1)
   const safeLimit = Math.min(50, Math.max(1, Number(limit) || 20))
   const offset = (safePage - 1) * safeLimit

   const where = {}

   if (filters.action) where.action = filters.action
   if (filters.user_id) where.user_id = Number(filters.user_id)
   if (filters.admin_id) where.admin_id = Number(filters.admin_id)

   // 기간 필터 (YYYY-MM-DD)
   if (filters.created_start || filters.created_end) {
      const start = filters.created_start || filters.created_end
      const end = filters.created_end || filters.created_start
      const startAt = new Date(`${start}T00:00:00.000`)
      const endAt = new Date(`${end}T23:59:59.999`)
      where.createdAt = { [Op.between]: [startAt, endAt] }
   }

   const { count, rows } = await AdminHistory.findAndCountAll({
      where,
      include: [
         {
            model: AdminUser,
            as: 'admin',
            attributes: ['admin_id', 'name', 'role'],
            required: false,
         },
         {
            model: User,
            as: 'user',
            attributes: ['user_id', 'name', 'profile_img', 'state'],
            required: false,
         },
      ],
      limit: safeLimit,
      offset,
      order: [['createdAt', 'DESC']],
      distinct: true,
   })

   const items = rows.map((h) => {
      const plain = h.get({ plain: true })

      return {
         history_id: plain.history_id,
         action: plain.action,
         message: plain.message,
         meta: plain.meta, // TEXT (stringified JSON일 수 있음)
         created_at: plain.created_at ?? plain.createdAt,

         admin_id: plain.admin_id,
         user_id: plain.user_id,

         admin: plain.admin
            ? {
                 admin_id: plain.admin.admin_id,
                 name: plain.admin.name,
                 role: plain.admin.role,
              }
            : null,

         user: plain.user
            ? {
                 user_id: plain.user.user_id,
                 name: plain.user.name,
                 profile_img: plain.user.profile_img,
                 state: plain.user.state,
              }
            : null,
      }
   })

   return {
      success: true,
      items,
      total: count,
      page: safePage,
      limit: safeLimit,
   }
}
