// moovy-api/src/routes/admin/users.js
import express from 'express'
import { body, param, query, validationResult } from 'express-validator'
import db from '../../models/index.js' // 프로젝트의 index.js export 확인
// 관리자 인증/권한 미들웨어 (프로젝트 기존 미들웨어로 교체)
import { requireAdminAuth, requireRole } from '../middlewares.js' // 경로/이름은 프로젝트에 맞게

const router = express.Router()

// ──────────────────────────────────────────────────────────────
// 유틸
const ensureValid = (req) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      const err = new Error('Validation failed')
      err.status = 400
      err.details = errors.array()
      throw err
   }
}

// 상태 상수 (실제 ENUM 값과 반드시 일치시킬 것)
const USER_STATE = {
   ACTIVE: 'ACTIVE',
   SUSPENDED: 'SUSPENDED', // 모델의 철자와 동일해야 함
   DELETED: 'DELETED',
}

// ──────────────────────────────────────────────────────────────
// 1) 유저 목록
router.get(
   '/users',
   requireAdminAuth,
   requireRole(['ADMIN', 'SUPERADMIN']),
   [
      query('page').optional().isInt({ min: 1 }).toInt(),
      query('size').optional().isInt({ min: 1, max: 100 }).toInt(),
      query('search').optional().isString().trim(),
      query('state').optional().isIn(Object.values(USER_STATE)),
      query('provider').optional().isIn(['google', 'kakao', 'email']), // 필요 시 수정
      query('sort').optional().isIn(['created_at', 'updated_at', 'name']),
      query('order').optional().isIn(['ASC', 'DESC']),
   ],
   async (req, res, next) => {
      try {
         ensureValid(req)
         const { page = 1, size = 20, search = '', state, provider, sort = 'created_at', order = 'DESC' } = req.query

         const where = {}
         if (state) where.state = state
         if (provider) where[provider] = 1 // google/kakao 플래그(TINYINT(1)) 가정

         if (search) {
            where.name = { [db.Sequelize.Op.like]: `%${search}%` }
            // 이메일로도 찾고 싶다면 Op.or 구성
            // where[db.Sequelize.Op.or] = [
            //   { name: { [db.Sequelize.Op.like]: `%${search}%` } },
            //   { email: { [db.Sequelize.Op.like]: `%${search}%` } },
            // ]
         }

         const { rows, count } = await db.User.findAndCountAll({
            where,
            order: [[sort, order]],
            offset: (page - 1) * size,
            limit: size,
            attributes: ['user_id', 'email', 'name', 'state', 'google', 'kakao', 'created_at', 'updated_at', 'deleted_at'],
            paranoid: false, // 삭제된 유저도 목록에 보일지 정책에 따라
         })

         res.json({
            items: rows,
            page,
            size,
            total: count,
            totalPages: Math.ceil(count / size),
         })
      } catch (err) {
         next(err)
      }
   }
)

// 2) 유저 상세(제재 이력 포함)
router.get('/users/:user_id', requireAdminAuth, requireRole(['ADMIN', 'SUPERADMIN']), [param('user_id').isInt({ min: 1 }).toInt()], async (req, res, next) => {
   try {
      ensureValid(req)
      const { user_id } = req.params

      const user = await db.User.findOne({
         where: { user_id },
         attributes: {
            exclude: ['password'], // 비번 제외
         },
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

      if (!user) return res.status(404).json({ message: 'User not found' })
      res.json(user)
   } catch (err) {
      next(err)
   }
})

// 3) 유저 제재 생성
router.post(
   '/users/:user_id/sanctions',
   requireAdminAuth,
   requireRole(['ADMIN', 'SUPERADMIN']),
   [
      param('user_id').isInt({ min: 1 }).toInt(),
      body('start_at').optional().isISO8601().toDate(),
      body('end_at').isISO8601().toDate(), // 필수: 종료 시점
      body('reason').isString().trim().isLength({ min: 2, max: 2000 }),
   ],
   async (req, res, next) => {
      const t = await db.sequelize.transaction()
      try {
         ensureValid(req)
         const { user_id } = req.params
         const admin_id = req.user.admin_id // 토큰에서 주입
         const { start_at, end_at, reason } = req.body

         const user = await db.User.findByPk(user_id, { transaction: t, paranoid: false })
         if (!user) {
            await t.rollback()
            return res.status(404).json({ message: 'User not found' })
         }
         if (user.state === USER_STATE.DELETED) {
            await t.rollback()
            return res.status(400).json({ message: 'Cannot sanction a deleted user' })
         }

         const start = start_at ? new Date(start_at) : new Date()
         const end = new Date(end_at)
         if (end <= start) {
            await t.rollback()
            return res.status(400).json({ message: 'end_at must be after start_at' })
         }

         const sanction = await db.UserSanction.create({ user_id, admin_id, start_at: start, end_at: end, reason }, { transaction: t })

         // 상태 전환 → SUSPENDED
         await user.update({ state: USER_STATE.SUSPENDED }, { transaction: t })

         await t.commit()
         res.status(201).json({ message: 'Sanction created', sanction })
      } catch (err) {
         await db.sequelize.transaction((trx) => trx.rollback?.()).catch(() => {})
         next(err)
      }
   }
)

// 4) 유저 제재 수정(사유/기간/조기해제)
router.patch(
   '/users/:user_id/sanctions/:id',
   requireAdminAuth,
   requireRole(['ADMIN', 'SUPERADMIN']),
   [param('user_id').isInt({ min: 1 }).toInt(), param('id').isInt({ min: 1 }).toInt(), body('reason').optional().isString().trim().isLength({ min: 1, max: 2000 }), body('end_at').optional().isISO8601().toDate(), body('early_release').optional().isBoolean()],
   async (req, res, next) => {
      const t = await db.sequelize.transaction()
      try {
         ensureValid(req)
         const { user_id, id } = req.params
         const { reason, end_at, early_release } = req.body

         const sanction = await db.UserSanction.findOne({
            where: { id, user_id },
            transaction: t,
            lock: t.LOCK.UPDATE,
         })
         if (!sanction) {
            await t.rollback()
            return res.status(404).json({ message: 'Sanction not found' })
         }

         const patch = {}
         if (reason != null) patch.reason = reason
         if (end_at != null) {
            const end = new Date(end_at)
            if (sanction.start_at && end <= sanction.start_at) {
               await t.rollback()
               return res.status(400).json({ message: 'end_at must be after start_at' })
            }
            patch.end_at = end
         }

         await sanction.update(patch, { transaction: t })

         if (early_release) {
            // 조기 해제 → 사용자 상태 ACTIVE
            const user = await db.User.findByPk(user_id, { transaction: t, lock: t.LOCK.UPDATE })
            if (user && user.state === USER_STATE.SUSPENDED) {
               await user.update({ state: USER_STATE.ACTIVE }, { transaction: t })
            }
         }

         await t.commit()
         res.json({ message: 'Sanction updated', sanction })
      } catch (err) {
         await db.sequelize.transaction((trx) => trx.rollback?.()).catch(() => {})
         next(err)
      }
   }
)

// 5) 유저 제재 취소
router.delete('/users/:user_id/sanctions/:id', requireAdminAuth, requireRole(['ADMIN', 'SUPERADMIN']), [param('user_id').isInt({ min: 1 }).toInt(), param('id').isInt({ min: 1 }).toInt()], async (req, res, next) => {
   const t = await db.sequelize.transaction()
   try {
      ensureValid(req)
      const { user_id, id } = req.params

      const sanction = await db.UserSanction.findOne({
         where: { id, user_id },
         transaction: t,
         lock: t.LOCK.UPDATE,
      })
      if (!sanction) {
         await t.rollback()
         return res.status(404).json({ message: 'Sanction not found' })
      }

      await sanction.destroy({ transaction: t })

      // 필요 시 사용자 상태 복구
      const user = await db.User.findByPk(user_id, { transaction: t, lock: t.LOCK.UPDATE })
      if (user && user.state === USER_STATE.SUSPENDED) {
         await user.update({ state: USER_STATE.ACTIVE }, { transaction: t })
      }

      await t.commit()
      res.json({ message: 'Sanction deleted' })
   } catch (err) {
      await db.sequelize.transaction((trx) => trx.rollback?.()).catch(() => {})
      next(err)
   }
})

// 6) 강제 탈퇴
router.post(
   '/users/:user_id/force-withdrawal',
   requireAdminAuth,
   requireRole(['SUPERADMIN']), // 정책상 슈퍼관리자만 허용을 추천
   [
      param('user_id').isInt({ min: 1 }).toInt(),
      body('reason').isString().trim().isLength({ min: 2, max: 2000 }),
      body('confirm').isBoolean(), // 프런트 confirm 여부 전달
   ],
   async (req, res, next) => {
      const t = await db.sequelize.transaction()
      try {
         ensureValid(req)
         const { user_id } = req.params
         const { reason, confirm } = req.body
         const admin_id = req.user.admin_id

         if (!confirm) {
            await t.rollback()
            return res.status(400).json({ message: 'Confirmation required' })
         }

         const user = await db.User.findByPk(user_id, { transaction: t, paranoid: false, lock: t.LOCK.UPDATE })
         if (!user) {
            await t.rollback()
            return res.status(404).json({ message: 'User not found' })
         }
         if (user.state === USER_STATE.DELETED) {
            await t.rollback()
            return res.status(400).json({ message: 'Already deleted' })
         }

         // 감사 로그 겸 기록: 제재 테이블에 남긴다(타입 컬럼이 없으므로 reason에 표기)
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

         // 상태 전환 + 소프트 삭제
         await user.update({ state: USER_STATE.DELETED }, { transaction: t })
         await user.destroy({ transaction: t }) // paranoid: true 라면 deleted_at 세팅

         await t.commit()
         res.json({ message: 'User forcibly withdrawn' })
      } catch (err) {
         await db.sequelize.transaction((trx) => trx.rollback?.()).catch(() => {})
         next(err)
      }
   }
)

export default router
