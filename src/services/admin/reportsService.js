// moovy-api/src/services/admin/reportsService.js

import { Op } from 'sequelize'
import db from '../../models/index.js'

const { CommentReport, CommentReplyReport, CommentTbl, CommentReply, User, UserSanction } = db

function toMs(v) {
   const t = v ? new Date(v).getTime() : NaN
   return Number.isNaN(t) ? null : t
}

function diffAbs(a, b) {
   if (a == null || b == null) return null
   return Math.abs(a - b)
}

async function attachActions(items) {
   const completed = (items || []).filter((it) => it?.deleted_at && it?.reported?.user_id)
   if (completed.length === 0) return items

   const userIds = Array.from(new Set(completed.map((it) => Number(it.reported.user_id)).filter((n) => Number.isFinite(n))))
   if (userIds.length === 0) return items

   const sanctions = await UserSanction.findAll({
      paranoid: false,
      where: {
         user_id: { [Op.in]: userIds },
      },
      attributes: ['id', 'user_id', 'start_at', 'end_at', 'reason', 'createdAt', 'updatedAt', 'deletedAt'],
      order: [['createdAt', 'DESC']],
   })

   const sanctionsByUser = new Map()
   for (const s of sanctions) {
      const uid = Number(s.user_id)
      if (!sanctionsByUser.has(uid)) sanctionsByUser.set(uid, [])
      sanctionsByUser.get(uid).push(s)
   }

   const WINDOW_BEFORE_MS = 30 * 60 * 1000 // 30분
   const WINDOW_AFTER_MS = 5 * 60 * 1000 // 5분

   for (const it of completed) {
      const uid = Number(it.reported.user_id)
      const list = sanctionsByUser.get(uid) || []
      const completedAtMs = toMs(it.deleted_at)
      if (!completedAtMs) {
         it.action = '조치 안함'
         continue
      }

      let best = null
      let bestScore = null

      for (const s of list) {
         const createdMs = toMs(s.createdAt)
         if (!createdMs) continue

         // 제재 생성 -> 신고 처리완료 순서이므로, completedAt 근처(이전) 생성 제재를 우선 매칭
         const delta = completedAtMs - createdMs
         if (delta < -WINDOW_AFTER_MS || delta > WINDOW_BEFORE_MS) continue

         const score = Math.abs(delta)
         if (bestScore == null || score < bestScore) {
            best = s
            bestScore = score
         }
      }

      if (best) {
         it.action = '제재'
         it.sanction = {
            id: best.id,
            start_at: best.start_at,
            end_at: best.end_at,
            reason: best.reason,
         }
      } else {
         it.action = '조치 안함'
      }
   }

   return items
}

function toKoreanCategory(code) {
   switch (code) {
      case 'SPAM':
         return '스팸'
      case 'SPOILER':
         return '스포일러'
      case 'ABUSE':
         return '부적절한 언행'
      case 'HARASSMENT':
         return '도배'
      case 'OTHER':
      default:
         return '기타'
   }
}

function normalizeReport({ type, report, reporter, reported, targetContent, targetId }) {
   const createdAt = report.createdAt || report.created_at
   const deletedAt = report.deletedAt || report.deleted_at

   return {
      type, // 'comment' | 'reply'
      report_id: report.report_id,
      reporter: reporter ? { user_id: reporter.user_id, name: reporter.name, profile_img: reporter.profile_img ?? null } : { user_id: report.reporter_id, name: '-', profile_img: null },
      reported: reported ? { user_id: reported.user_id, name: reported.name, profile_img: reported.profile_img ?? null } : { user_id: report.reported_id, name: '-', profile_img: null },
      post: {
         type: type === 'comment' ? '코멘트' : '댓글',
         id: targetId,
         content: targetContent ?? '',
      },
      report_type: report.report_type,
      category: toKoreanCategory(report.report_type),
      report_content: toKoreanCategory(report.report_type),
      created_at: createdAt,
      deleted_at: deletedAt,
      status: deletedAt ? '처리완료' : '대기중',
      action: undefined,
      sanction: undefined,
   }
}

export async function getList(page = 1, limit = 10, filters = {}) {
   const safePage = Math.max(1, Number(page))
   const safeLimit = Math.min(50, Number(limit))

   const status = filters.status

   const createdAtWhere = {}
   if (filters.created_start || filters.created_end) {
      const start = filters.created_start || filters.created_end
      const end = filters.created_end || filters.created_start
      createdAtWhere.createdAt = {
         [Op.between]: [new Date(`${start}T00:00:00.000`), new Date(`${end}T23:59:59.999`)],
      }
   }

   const deletedAtWhere = {}
   if (status === 'PENDING') deletedAtWhere.deletedAt = { [Op.is]: null }
   if (status === 'COMPLETED') deletedAtWhere.deletedAt = { [Op.not]: null }

   const reporterWhere = {}
   if (filters.reporter) reporterWhere.name = { [Op.like]: `%${filters.reporter}%` }

   const reportedWhere = {}
   if (filters.reported) reportedWhere.name = { [Op.like]: `%${filters.reported}%` }

   const baseWhere = {
      ...createdAtWhere,
      ...deletedAtWhere,
   }
   if (filters.report_type) baseWhere.report_type = filters.report_type

   const wantsType = filters.post_type

   const commentRows =
      !wantsType || wantsType === 'comment'
         ? await CommentReport.findAll({
              paranoid: false,
              where: {
                 ...baseWhere,
                 ...(filters.post_id ? { comment_id: Number(filters.post_id) } : {}),
              },
              include: [
                 {
                    model: User,
                    as: 'commentReporter',
                    attributes: ['user_id', 'name', 'profile_img'],
                    required: Object.keys(reporterWhere).length > 0,
                    where: Object.keys(reporterWhere).length > 0 ? reporterWhere : undefined,
                 },
                 {
                    model: User,
                    as: 'commentReported',
                    attributes: ['user_id', 'name', 'profile_img'],
                    required: Object.keys(reportedWhere).length > 0,
                    where: Object.keys(reportedWhere).length > 0 ? reportedWhere : undefined,
                 },
                 {
                    model: CommentTbl,
                    attributes: ['comment_id', 'contnet'],
                    required: false,
                 },
              ],
                     order: [['createdAt', 'ASC']],
           })
         : []

   const replyRows =
      !wantsType || wantsType === 'reply'
         ? await CommentReplyReport.findAll({
              paranoid: false,
              where: {
                 ...baseWhere,
                 ...(filters.post_id ? { reply_id: Number(filters.post_id) } : {}),
              },
              include: [
                 {
                    model: User,
                    as: 'reporter',
                    attributes: ['user_id', 'name', 'profile_img'],
                    required: Object.keys(reporterWhere).length > 0,
                    where: Object.keys(reporterWhere).length > 0 ? reporterWhere : undefined,
                 },
                 {
                    model: User,
                    as: 'reported',
                    attributes: ['user_id', 'name', 'profile_img'],
                    required: Object.keys(reportedWhere).length > 0,
                    where: Object.keys(reportedWhere).length > 0 ? reportedWhere : undefined,
                 },
                 {
                    model: CommentReply,
                    attributes: ['reply_id', 'content'],
                    required: false,
                 },
              ],
                     order: [['createdAt', 'ASC']],
           })
         : []

   const normalized = [
      ...commentRows.map((r) =>
         normalizeReport({
            type: 'comment',
            report: r,
            reporter: r.commentReporter,
            reported: r.commentReported,
            targetId: r.comment_id,
            targetContent: r.CommentTbl?.contnet ?? '',
         })
      ),
      ...replyRows.map((r) =>
         normalizeReport({
            type: 'reply',
            report: r,
            reporter: r.reporter,
            reported: r.reported,
            targetId: r.reply_id,
            targetContent: r.CommentReply?.content ?? '',
         })
      ),
   ]

   const statusRank = (r) => (r.status === '대기중' ? 0 : 1)
   normalized.sort((a, b) => {
      const sr = statusRank(a) - statusRank(b)
      if (sr !== 0) return sr

      const at = new Date(a.created_at).getTime()
      const bt = new Date(b.created_at).getTime()
      if (at !== bt) return at - bt // 오래된 순

      if (a.type !== b.type) return a.type < b.type ? -1 : 1
      return Number(a.report_id) - Number(b.report_id)
   })

   const total = normalized.length
   const totalPages = Math.max(1, Math.ceil(total / safeLimit))
   const start = (safePage - 1) * safeLimit
   const items = normalized.slice(start, start + safeLimit)

   await attachActions(items)

   return {
      pagination: { page: safePage, limit: safeLimit, total, totalPages },
      list: items,
   }
}

export async function getDetail(type, report_id) {
   if (type === 'comment') {
      const report = await CommentReport.findByPk(report_id, {
         paranoid: false,
         include: [
            { model: User, as: 'commentReporter', attributes: ['user_id', 'name', 'profile_img'], required: false },
            { model: User, as: 'commentReported', attributes: ['user_id', 'name', 'profile_img'], required: false },
            { model: CommentTbl, attributes: ['comment_id', 'contnet'], required: false },
         ],
      })
      if (!report) return null
      const item = normalizeReport({
         type: 'comment',
         report,
         reporter: report.commentReporter,
         reported: report.commentReported,
         targetId: report.comment_id,
         targetContent: report.CommentTbl?.contnet ?? '',
      })
      await attachActions([item])
      return item
   }

   const report = await CommentReplyReport.findByPk(report_id, {
      paranoid: false,
      include: [
         { model: User, as: 'reporter', attributes: ['user_id', 'name', 'profile_img'], required: false },
         { model: User, as: 'reported', attributes: ['user_id', 'name', 'profile_img'], required: false },
         { model: CommentReply, attributes: ['reply_id', 'content'], required: false },
      ],
   })
   if (!report) return null
   const item = normalizeReport({
      type: 'reply',
      report,
      reporter: report.reporter,
      reported: report.reported,
      targetId: report.reply_id,
      targetContent: report.CommentReply?.content ?? '',
   })
   await attachActions([item])
   return item
}

export async function complete(type, report_id, action) {
   const act = String(action || '').toUpperCase()
   if (type === 'comment') {
      const report = await CommentReport.findByPk(report_id)
      if (!report) return null

      if (act === 'SANCTION') {
         const commentId = report.comment_id
         if (commentId != null) {
            const target = await CommentTbl.findByPk(commentId)
            if (target) await target.destroy() // paranoid => soft delete
         }
      }

      await report.destroy() // paranoid => soft delete
      return { type, report_id, deleted_at: new Date().toISOString(), action: act === 'SANCTION' ? 'SANCTION' : 'NONE' }
   }

   const report = await CommentReplyReport.findByPk(report_id)
   if (!report) return null

   if (act === 'SANCTION') {
      const replyId = report.reply_id
      if (replyId != null) {
         const target = await CommentReply.findByPk(replyId)
         if (target) await target.destroy() // paranoid => soft delete
      }
   }

   await report.destroy()
   return { type, report_id, deleted_at: new Date().toISOString(), action: act === 'SANCTION' ? 'SANCTION' : 'NONE' }
}
