// moovy-api/src/services/usersService.js
import db from '../../models/index.js'
import { USER_STATE } from '../constants/admin/userConstants.js'

const { Op } = db.Sequelize

// ──────────────────────────────────────────────────────────────
// 목록 조회
export async function listUsers({ page = 1, size = 20, search = '', state, provider, sort = 'created_at', order = 'DESC' }) {
   const where = {}

   if (state) where.state = state

   // provider 필터 명확화 (google/kakao는 flag=1, email은 소셜X)
   if (provider === 'google') where.google = 1
   else if (provider === 'kakao') where.kakao = 1
   else if (provider === 'email') {
      where.google = 0
      where.kakao = 0
   }

   if (search) {
      where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }]
   }

   const { rows, count } = await db.User.findAndCountAll({
      where,
      order: [[sort, order]],
      offset: (page - 1) * size,
      limit: size,
      attributes: ['user_id', 'email', 'name', 'state', 'google', 'kakao', 'created_at', 'updated_at', 'deleted_at'],
      paranoid: false,
   })

   return {
      items: rows,
      page,
      size,
      total: count,
      totalPages: Math.ceil(count / size),
   }
}

// ──────────────────────────────────────────────────────────────
// 상세 조회 (제재 이력 포함)
export async function getUserDetail(user_id) {
   return db.User.findOne({
      where: { user_id },
      attributes: { exclude: ['password'] },
      paranoid: false,
      include: [
         {
            model: db.UserSanction,
            as: 'sanctions',
            required: false,
            separate: true,
            order: [['created_at', 'DESC']],
         },
      ],
   })
}

// ──────────────────────────────────────────────────────────────
// 제재 생성
export async function createSanction({ user_id, admin_id, start_at, end_at, reason }) {
   return db.sequelize.transaction(async (t) => {
      const user = await db.User.findByPk(user_id, {
         transaction: t,
         paranoid: false,
         lock: t.LOCK.UPDATE,
      })
      if (!user) throw httpError(404, '사용자를 찾을 수 없습니다.')
      if (user.state === USER_STATE.DELETED) throw httpError(400, '탈퇴 처리된 사용자는 제재할 수 없습니다.')

      const start = start_at ? new Date(start_at) : new Date()
      const end = new Date(end_at)
      if (end <= start) throw httpError(400, '제재 종료일은 시작일 이후여야 합니다.')

      const sanction = await db.UserSanction.create({ user_id, admin_id, start_at: start, end_at: end, reason }, { transaction: t })

      await user.update({ state: USER_STATE.SUSPENDED }, { transaction: t })
      return sanction
   })
}

// ──────────────────────────────────────────────────────────────
// 제재 수정 (사유/기간/조기해제)
export async function updateSanction({ user_id, id, reason, end_at, early_release }) {
   return db.sequelize.transaction(async (t) => {
      const sanction = await db.UserSanction.findOne({
         where: { id, user_id },
         transaction: t,
         lock: t.LOCK.UPDATE,
      })
      if (!sanction) throw httpError(404, '제재 이력을 찾을 수 없습니다.')

      const patch = {}
      if (reason != null) patch.reason = reason
      if (end_at != null) {
         const end = new Date(end_at)
         if (sanction.start_at && end <= sanction.start_at) {
            throw httpError(400, '제재 종료일은 시작일 이후여야 합니다.')
         }
         patch.end_at = end
      }

      await sanction.update(patch, { transaction: t })

      if (early_release) {
         const user = await db.User.findByPk(user_id, { transaction: t, lock: t.LOCK.UPDATE })
         if (user && user.state === USER_STATE.SUSPENDED) {
            await user.update({ state: USER_STATE.ACTIVE }, { transaction: t })
         }
      }
      return sanction
   })
}

// ──────────────────────────────────────────────────────────────
// 제재 취소
export async function deleteSanction({ user_id, id }) {
   return db.sequelize.transaction(async (t) => {
      const sanction = await db.UserSanction.findOne({
         where: { id, user_id },
         transaction: t,
         lock: t.LOCK.UPDATE,
      })
      if (!sanction) throw httpError(404, '제재 이력을 찾을 수 없습니다.')

      await sanction.destroy({ transaction: t })

      const user = await db.User.findByPk(user_id, { transaction: t, lock: t.LOCK.UPDATE })
      if (user && user.state === USER_STATE.SUSPENDED) {
         await user.update({ state: USER_STATE.ACTIVE }, { transaction: t })
      }
   })
}

// ──────────────────────────────────────────────────────────────
// 강제 탈퇴
export async function forceWithdrawal({ user_id, admin_id, reason, confirm }) {
   if (!confirm) throw httpError(400, '강제 탈퇴를 진행하려면 confirm 값이 필요합니다.')

   return db.sequelize.transaction(async (t) => {
      const user = await db.User.findByPk(user_id, {
         transaction: t,
         paranoid: false,
         lock: t.LOCK.UPDATE,
      })
      if (!user) throw httpError(404, '사용자를 찾을 수 없습니다.')
      if (user.state === USER_STATE.DELETED) throw httpError(400, '이미 탈퇴 처리된 사용자입니다.')

      await db.UserSanction.create(
         {
            user_id,
            admin_id,
            start_at: new Date(),
            end_at: new Date(),
            reason: `[FORCE_WITHDRAWAL] ${reason}`,
         },
         { transaction: t }
      )

      await user.update({ state: USER_STATE.DELETED }, { transaction: t })
      await user.destroy({ transaction: t }) // paranoid=true면 deleted_at만 세팅
      return true
   })
}

// ──────────────────────────────────────────────────────────────
// 내부 유틸
function httpError(status, message) {
   const e = new Error(message)
   e.status = status
   return e
}
