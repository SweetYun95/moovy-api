// moovy-api/src/services/usersService.js
import db from '../../models/index.js'
import { USER_STATE } from '../../constants/admin/userConstants.js'

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
      attributes: [
         'user_id',
         'email',
         'name',
         'state',
         'profile_img',
         'google',
         'kakao',
         'created_at',
         'updated_at',
         'deleted_at',
         [
            db.sequelize.literal(`(
               SELECT COUNT(*)
               FROM comment_tbls AS c
               WHERE c.user_id = User.user_id
                 AND c.deleted_at IS NULL
            )`),
            'comment_count',
         ],
         [
            db.sequelize.literal(`(
               SELECT COUNT(*)
               FROM comment_replies AS r
               WHERE r.user_id = User.user_id
                 AND r.deleted_at IS NULL
            )`),
            'reply_count',
         ],
         [
            db.sequelize.literal(`(
               SELECT COUNT(*)
               FROM user_sanctions AS s
               WHERE s.user_id = User.user_id
                 AND s.deleted_at IS NULL
            )`),
            'sanction_count',
         ],
      ],
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

async function resolveAdminId(admin_id, t) {
   const isValidNumber = (v) => typeof v === 'number' || (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)))
   const candidate = isValidNumber(admin_id) ? Number(admin_id) : null

   if (candidate != null) {
      const exists = await db.AdminUser.findByPk(candidate, { transaction: t, paranoid: false })
      if (exists) return candidate
   }

   const first = await db.AdminUser.findOne({
      attributes: ['admin_id'],
      order: [['admin_id', 'ASC']],
      transaction: t,
      paranoid: false,
   })

   if (first?.admin_id) return first.admin_id
   throw httpError(500, '관리자 계정이 없어 제재를 생성할 수 없습니다. admin_users를 시드하거나 DEV_ADMIN_ID를 설정하세요.')
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
      const resolvedAdminId = await resolveAdminId(admin_id, t)

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

      const sanction = await db.UserSanction.create({ user_id, admin_id: resolvedAdminId, start_at: start, end_at: end, reason }, { transaction: t })

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
      const resolvedAdminId = await resolveAdminId(admin_id, t)

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
            admin_id: resolvedAdminId,
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
// 관리자: 사용자 프로필(닉네임) 수정
export async function updateUserProfileByAdmin({ user_id, name }) {
   return db.sequelize.transaction(async (t) => {
      const user = await db.User.findByPk(user_id, {
         transaction: t,
         paranoid: false,
         lock: t.LOCK.UPDATE,
      })
      if (!user) throw httpError(404, '사용자를 찾을 수 없습니다.')
      if (user.state === USER_STATE.DELETED) throw httpError(400, '탈퇴 처리된 사용자는 수정할 수 없습니다.')

      const patch = {}
      if (name != null) patch.name = name

      if (Object.keys(patch).length > 0) {
         await user.update(patch, { transaction: t })
      }

      const data = user.toJSON ? user.toJSON() : user
      return {
         user_id: data.user_id,
         name: data.name,
         email: data.email,
         profile_img: data.profile_img,
         state: data.state,
      }
   })
}

// ──────────────────────────────────────────────────────────────
// 관리자: 사용자 프로필 이미지 기본값(삭제)
export async function resetUserProfileImageByAdmin({ user_id }) {
   return db.sequelize.transaction(async (t) => {
      const user = await db.User.findByPk(user_id, {
         transaction: t,
         paranoid: false,
         lock: t.LOCK.UPDATE,
      })
      if (!user) throw httpError(404, '사용자를 찾을 수 없습니다.')
      if (user.state === USER_STATE.DELETED) throw httpError(400, '탈퇴 처리된 사용자는 수정할 수 없습니다.')

      await user.update({ profile_img: null }, { transaction: t })
      const data = user.toJSON ? user.toJSON() : user
      return {
         user_id: data.user_id,
         name: data.name,
         email: data.email,
         profile_img: data.profile_img,
         state: data.state,
      }
   })
}

// ──────────────────────────────────────────────────────────────
// 내부 유틸
function httpError(status, message) {
   const e = new Error(message)
   e.status = status
   return e
}
