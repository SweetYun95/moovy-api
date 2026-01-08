// moovy-api/src/services/admin/dashboardService.js
import { Sequelize } from 'sequelize'
import db from '../../models/index.js'

const { Op } = Sequelize

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
   // ✅ 모델명은 너희 프로젝트에 맞게 확인
   // TODO: 실제 유저 모델명 확인 (예: db.User)
   const User = db.User
   // TODO: 실제 컨텐츠 모델명 확인 (예: db.VideoContent)
   const VideoContent = db.VideoContent
   // TODO: 실제 코멘트 모델명 확인 (예: db.CommentTbl)
   const CommentTbl = db.CommentTbl

   // year 기준 범위
   const fromThisYear = new Date(year, 0, 1)
   const toThisYear = new Date(year + 1, 0, 1)
   const fromLastYear = new Date(year - 1, 0, 1)
   const toLastYear = new Date(year, 0, 1)

   // ─────────────────────────────
   // 1) 월별 사용자 수 (월간 가입자 수 기준)
   //    * 프론트 차트 라벨이 "총 사용자 수"라면
   //      누적이 더 자연스럽지만,
   //      일단 월간 가입자 수로 시작해도 UX 괜찮음.
   // ─────────────────────────────
   const usersThisYearRaw = await User.findAll({
      attributes: [
         [Sequelize.fn('MONTH', Sequelize.col('created_at')), 'm'],
         [Sequelize.fn('COUNT', Sequelize.col('*')), 'cnt'],
      ],
      where: {
         created_at: { [Op.gte]: fromThisYear, [Op.lt]: toThisYear },
         // TODO: soft delete나 state 필터가 필요하면 추가
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

   // 월(1~12) → 카운트 맵으로 변환
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

   // 프론트가 1~7월만 쓰더라도, 서버는 1~12로 주는 게 보통 더 좋음
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
   // ─────────────────────────────
   // TODO: CommentTbl에 어떤 FK로 컨텐츠가 연결되는지 확인
   //  - content_id / video_content_id / movie_id 등
   const contentIdCol = 'content_id' // ✅ 여기 바꿀 수도 있음

   const topCommentedRaw = await CommentTbl.findAll({
      attributes: [
         [Sequelize.col(contentIdCol), 'id'],
         [Sequelize.fn('COUNT', Sequelize.col('*')), 'value'],
      ],
      group: [Sequelize.col(contentIdCol)],
      order: [[Sequelize.literal('value'), 'DESC']],
      limit: topN,
      raw: true,
   })

   // 컨텐츠 제목 붙이기
   const topCommentedIds = topCommentedRaw.map((r) => Number(r.id)).filter(Boolean)

   const contentsForComments = topCommentedIds.length
      ? await VideoContent.findAll({
           attributes: ['id', 'title'], // TODO: title 컬럼명 확인
           where: { id: { [Op.in]: topCommentedIds } },
           raw: true,
        })
      : []

   const titleMap = new Map(contentsForComments.map((c) => [Number(c.id), c.title]))

   const topCommented = topCommentedRaw.map((r) => ({
      id: Number(r.id),
      label: titleMap.get(Number(r.id)) ?? `컨텐츠 ${r.id}`,
      value: Number(r.value),
   }))

   // ─────────────────────────────
   // 3) 조회수 TOP N
   // ─────────────────────────────
   // TODO: 조회수 컬럼명이 views인지 view_count인지 확인
   const viewCol = 'views'

   const topViewedRaw = await VideoContent.findAll({
      attributes: ['id', 'title', [Sequelize.col(viewCol), 'value']],
      order: [[Sequelize.col(viewCol), 'DESC']],
      limit: topN,
      raw: true,
   })

   const topViewed = topViewedRaw.map((r) => ({
      id: Number(r.id),
      label: r.title ?? `컨텐츠 ${r.id}`,
      value: Number(r.value ?? 0),
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
