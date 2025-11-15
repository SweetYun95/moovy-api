// src/services/ratingService.js
import db from '../models/index.js'
const { Rating } = db
const { fn, col } = db.sequelize

// ─────────────────────────────
// [CREATE or UPDATE] 별점 등록/수정 (업서트)
// ─────────────────────────────
export const upsert = async (userId, contentId, point) => {
   const [rating, created] = await Rating.findOrCreate({
      where: { user_id: userId, content_id: contentId },
      defaults: { point },
   })

   if (!created) {
      rating.point = point
      await rating.save()
   }

   const summary = await getSummary(contentId, userId)
   return { created, ...summary }
}

// ─────────────────────────────
// [DELETE] 내 별점 삭제
// ─────────────────────────────
export const remove = async (userId, contentId) => {
   await Rating.destroy({ where: { user_id: userId, content_id: contentId } })
   const summary = await getSummary(contentId, userId)
   return { removed: true, ...summary }
}

// ─────────────────────────────
// [READ] 평균, 개수, 내 점수 요약
// ─────────────────────────────
export const getSummary = async (contentId, userId) => {
   const aggregate = await Rating.findOne({
      where: { content_id: contentId },
      attributes: [
         [fn('COUNT', col('id')), 'count'],
         [fn('AVG', col('point')), 'avg'],
      ],
      raw: true,
   })

   const my = userId
      ? await Rating.findOne({
           where: { content_id: contentId, user_id: userId },
           attributes: ['point'],
           raw: true,
        })
      : null

   const count = Number(aggregate?.count || 0)
   const avg = count ? Math.round(Number(aggregate.avg) * 10) / 10 : 0
   return { content_id: contentId, count, avg, myPoint: my?.point ?? null }
}
