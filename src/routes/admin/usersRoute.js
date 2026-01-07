// moovy-api/src/routes/admin/usersRoute.js
import express from 'express'
import { requireAdminAuth, requireRole } from '../../middlewares/middlewares.js'
import { listUsersValidator, userDetailValidator, createSanctionValidator, updateSanctionValidator, deleteSanctionValidator, forceWithdrawalValidator, adminUpdateUserProfileValidator, adminUserProfileImageParamsValidator } from '../../validations/validators/admin/usersValidators.js'
import { ADMIN_ROLES } from '../../constants/admin/userConstants.js'
import * as ctrl from '../../controllers/admin/usersController.js'
import { uploadUserProfile } from '../../middlewares/upload.js'

const router = express.Router()

// 1) 유저 목록  → GET /api/admin/users
// 어드민 여부는 requireAdminAuth에서 체크
router.get('/', requireAdminAuth, listUsersValidator, ctrl.list)

// 2) 유저 상세  → GET /api/admin/users/:user_id
router.get('/:user_id', requireAdminAuth, userDetailValidator, ctrl.detail)

// 2-1) 유저 프로필(닉네임) 수정 → PUT /api/admin/users/:user_id/profile
router.put('/:user_id/profile', requireAdminAuth, adminUpdateUserProfileValidator, ctrl.updateProfile)

// 2-2) 유저 프로필 이미지 업로드 → PUT /api/admin/users/:user_id/profile/image
router.put('/:user_id/profile/image', requireAdminAuth, adminUserProfileImageParamsValidator, uploadUserProfile.single('image'), ctrl.updateProfileImage)

// 2-3) 유저 프로필 이미지 기본값(삭제) → DELETE /api/admin/users/:user_id/profile/image
router.delete('/:user_id/profile/image', requireAdminAuth, adminUserProfileImageParamsValidator, ctrl.resetProfileImage)

// 3) 제재 생성  → POST /api/admin/users/:user_id/sanctions
router.post('/:user_id/sanctions', requireAdminAuth, createSanctionValidator, ctrl.createSanction)

// 4) 제재 수정  → PATCH /api/admin/users/:user_id/sanctions/:id
router.patch('/:user_id/sanctions/:id', requireAdminAuth, updateSanctionValidator, ctrl.updateSanction)

// 5) 제재 취소  → DELETE /api/admin/users/:user_id/sanctions/:id
router.delete('/:user_id/sanctions/:id', requireAdminAuth, deleteSanctionValidator, ctrl.deleteSanction)

// 6) 강제 탈퇴(슈퍼관리자)  → POST /api/admin/users/:user_id/force-withdrawal
// 특정 롤만 체크 requireRole(['SUPERADMIN']) 유지
router.post('/:user_id/force-withdrawal', requireAdminAuth, requireRole(['SUPERADMIN']), forceWithdrawalValidator, ctrl.forceWithdrawal)

export default router
