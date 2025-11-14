// moovy-api/src/constants/admin/userConstants.js
// 관리자/유저 관리 도메인 상수

export const USER_STATE = Object.freeze({
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
})

export const ADMIN_ROLES = Object.freeze(['ADMIN', 'SUPERADMIN'])

export const PROVIDER_TYPES = Object.freeze(['google', 'kakao', 'email'])

export const USER_SORTABLE_FIELDS = Object.freeze(['created_at', 'updated_at', 'name'])

export const ORDER_DIRECTIONS = Object.freeze(['ASC', 'DESC'])
