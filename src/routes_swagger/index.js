/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: 인증 관련 API
 */

// Auth API 문서 import
import { authPaths } from './authRouteApi.js'

export const swaggerPaths = {
   ...authPaths,
}
