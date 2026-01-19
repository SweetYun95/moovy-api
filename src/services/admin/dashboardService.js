// moovy-api/src/services/admin/dashboardService.js
import { Op, Sequelize } from 'sequelize'
import db from '../../models/index.js'

/**
 * 기대 응답(프론트 AdminDashboardResponse와 맞춤):
 * {
 *   usersMonthly: [{ month, thisYear, lastYear }],
 *   topCommented: [{ label, value, id? }],
 *   topViewed: [{ label, value, id? }],
 *   meta: { generatedAt, range }
 * }
 */

export async function getDashboard({ year, topN }) {
   const User = db.User
   const VideoContent = db.VideoContent
   const Topic = db.Topic
   const CommentTbl = db.CommentTbl

   // year 기준 범위
   const fromThisYear = new Date(year, 0, 1)
   const toThisYear = new Date(year + 1, 0, 1)
   const fromLastYear = new Date(year - 1, 0, 1)
   const toLastYear = new Date(year, 0, 1)

   // ─────────────────────────────
   // 1) 월별 사용자 수 (월간 가입자 수 기준)
   // ─────────────────────────────
   const usersThisYearRaw = await User.findAll({
      attributes: [
         [Sequelize.fn('MONTH', Sequelize.col('created_at')), 'm'],
         [Sequelize.fn('COUNT', Sequelize.col('*')), 'cnt'],
      ],
      where: {
         created_at: { [Op.gte]: fromThisYear, [Op.lt]: toThisYear },
      },
      group: [Sequelize.fn('MONTH', Sequelize.col('created_at'))],
      raw: true,
   })

   const usersLastYearRaw = await User.findAll({
      attributes: [
         [Sequelize.fn('MONTH', Sequelize.col('created_at')), 'm'],
         [Sequelize.fn('COUNT', Sequelize.col('*')), 'cnt'],
      ],
      where: {
         created_at: { [Op.gte]: fromLastYear, [Op.lt]: toLastYear },
      },
      group: [Sequelize.fn('MONTH', Sequelize.col('created_at'))],
      raw: true,
   })

   const mapCounts = (rows) => {
      const m = new Map()
      rows.forEach((r) => {
         const month = Number(r.m)
         const cnt = Number(r.cnt)
         m.set(month, cnt)
      })
      return m
   }

   const thisMap = mapCounts(usersThisYearRaw)
   const lastMap = mapCounts(usersLastYearRaw)

   const usersMonthly = Array.from({ length: 12 }).map((_, i) => {
      const monthNum = i + 1
      return {
         month: `${monthNum}월`,
         thisYear: thisMap.get(monthNum) ?? 0,
         lastYear: lastMap.get(monthNum) ?? 0,
      }
   })

   // ─────────────────────────────
   // 2) 코멘트 많은 컨텐츠 TOP N
   //    CommentTbl -> Topic(topic_id) -> Topic.content_id -> VideoContent
   // ─────────────────────────────

   // 2-1) topic_id별 코멘트 수 집계
   const commentedByTopicRaw = await CommentTbl.findAll({
      attributes: [
         [Sequelize.col('topic_id'), 'topic_id'],
         [Sequelize.fn('COUNT', Sequelize.col('*')), 'cnt'],
      ],
      group: [Sequelize.col('topic_id')],
      order: [[Sequelize.literal('cnt'), 'DESC']],
      raw: true,
   })

   const topicIds = commentedByTopicRaw.map((r) => Number(r.topic_id)).filter(Boolean)

   // 2-2) topic_id -> content_id 매핑
   const topics = topicIds.length
      ? await Topic.findAll({
           attributes: ['topic_id', 'content_id'],
           where: { topic_id: { [Op.in]: topicIds } },
           raw: true,
        })
      : []

   const topicToContent = new Map(topics.map((t) => [Number(t.topic_id), Number(t.content_id)]))

   // 2-3) content_id로 재집계 (여러 topic이 같은 content를 가리킬 수 있음)
   const contentCountMap = new Map()
   for (const row of commentedByTopicRaw) {
      const tid = Number(row.topic_id)
      const cnt = Number(row.cnt)
      const cid = topicToContent.get(tid)
      if (!cid) continue
      contentCountMap.set(cid, (contentCountMap.get(cid) ?? 0) + cnt)
   }

   // 2-4) TOP N 추출
   const topContentIds = Array.from(contentCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([cid]) => cid)

   // 2-5) 컨텐츠 title 붙이기
   const contentsForComments = topContentIds.length
      ? await VideoContent.findAll({
           attributes: ['content_id', 'title'],
           where: { content_id: { [Op.in]: topContentIds } },
           raw: true,
        })
      : []

   const titleMap = new Map(contentsForComments.map((c) => [Number(c.content_id), c.title]))

   const topCommented = topContentIds.map((cid) => ({
      id: cid,
      label: titleMap.get(cid) ?? `컨텐츠 ${cid}`,
      value: contentCountMap.get(cid) ?? 0,
   }))

   // ─────────────────────────────
   // 3) 조회수 TOP N
   // ─────────────────────────────
   const topViewedRaw = await VideoContent.findAll({
      attributes: ['content_id', 'title', 'views'],
      order: [['views', 'DESC']],
      limit: topN,
      raw: true,
   })

   const topViewed = topViewedRaw.map((r) => ({
      id: Number(r.content_id),
      label: r.title ?? `컨텐츠 ${r.content_id}`,
      value: Number(r.views ?? 0),
   }))

   return {
      usersMonthly,
      topCommented,
      topViewed,
      meta: {
         generatedAt: new Date().toISOString(),
         range: { from: fromThisYear.toISOString(), to: toThisYear.toISOString() },
      },
   }
}
