/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: 인증 관련 API
 *   - name: QnA
 *     description: QnA 관련 API
 *   - name: Admin Auth
 *     description: 관리자 인증 관련 API
 *   - name: Admin QnA
 *     description: 관리자 QnA 관련 API
 */

// Auth API 문서 import
import { authPaths } from './authRouteApi.js'
// QnA API 문서 import
import { qnaPaths } from './qnaRouteApi.js'
// Admin Auth API 문서 import
import { adminAuthPaths } from './admin/authRouteApi.js'
// Admin QnA API 문서 import
import { adminQnaPaths } from './admin/qnaRouteApi.js'

export const swaggerPaths = {
   ...authPaths,
   ...qnaPaths,
   ...adminAuthPaths,
   ...adminQnaPaths,
}
