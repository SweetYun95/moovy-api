// moovy-api/src/routes/topicRoute.js
import { Router } from 'express'
import * as topicCtrl from '../controllers/topicController.js'

const router = Router()

/**
 * GET /api/topics
 * - query:
 *   - main: current | past | all (default: current)
 *   - page, limit (pagination)
 */
router.get('/', topicCtrl.listTopics)

/**
 * GET /api/topics/current
 * - “현재 진행중 토픽”만 깔끔하게 받고 싶을 때(프론트가 좋아함)
 */
router.get('/current', topicCtrl.getCurrentTopics)

/**
 * GET /api/topics/:topic_id
 * - 토픽 상세 + VideoContent 조인
 */
router.get('/:topic_id', topicCtrl.getTopicById)

export default router
