// moovy-api/src/services/favoriteService.js
import db from '../models/index.js'
import { UniqueConstraintError, Op } from 'sequelize'

/**
 * 최근순 찜 목록
 */
export const listMyFavorites = async ({ userId, page, limit, offset }) => {
   const { rows, count } = await db.Favorite.findAndCountAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit,
      offset,
      include: [
         {
            model: db.VideoContent,
            attributes: ['content_id', 'title'],
            include: [
               {
                  model: db.VideoContentImage,
                  attributes: ['img_url', 'order'],
                  limit: 1,
                  separate: true,
                  order: [['order', 'ASC']],
               },
            ],
         },
      ],
   })

   const items = rows.map((r) => ({
      content_id: r.content_id,
      title: r.VideoContent?.title ?? '',
      favorited_at: r.created_at,
      poster: r.VideoContent?.VideoContentImages?.[0]?.img_url ?? null,
   }))

   return { page, limit, total: count, items }
}

export const checkFavorite = async ({ userId, contentId }) => {
   const found = await db.Favorite.findOne({
      where: { user_id: userId, content_id: contentId },
   })
   return !!found
}

export const addFavorite = async ({ userId, contentId }) => {
   try {
      await db.sequelize.transaction(async (t) => {
         // 소프트 삭제된 콘텐츠는 제외(paranoid)
         const exists = await db.VideoContent.findOne({
            where: { content_id: contentId, deleted_at: { [Op.is]: null } },
            transaction: t,
            paranoid: true,
         })
         if (!exists) throw new Error('CONTENT_NOT_FOUND')

         await db.Favorite.create({ user_id: userId, content_id: contentId }, { transaction: t })
      })
      return { created: true }
   } catch (e) {
      if (e instanceof UniqueConstraintError) return { created: false, reason: 'ALREADY_FAVORITED' }
      if (e.message === 'CONTENT_NOT_FOUND') return { created: false, reason: 'CONTENT_NOT_FOUND' }
      throw e
   }
}

export const removeFavorite = async ({ userId, contentId }) => {
   await db.Favorite.destroy({ where: { user_id: userId, content_id: contentId } })
}

export const toggleFavorite = async ({ userId, contentId }) => {
   let isFavorite
   await db.sequelize.transaction(async (t) => {
      try {
         await db.Favorite.create({ user_id: userId, content_id: contentId }, { transaction: t })
         isFavorite = true
      } catch (err) {
         if (err instanceof UniqueConstraintError) {
            await db.Favorite.destroy({ where: { user_id: userId, content_id: contentId }, transaction: t })
            isFavorite = false
         } else {
            throw err
         }
      }
   })
   return { isFavorite }
}
