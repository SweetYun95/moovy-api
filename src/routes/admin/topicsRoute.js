// moovy-api/src/routes/admin/topicsRoute.js
import express from 'express'
import { requireRole } from '../../middlewares/middlewares.js'
import * as v from '../../validations/validators/admin/topicValidators.js'
import * as popularV from '../../validations/validators/admin/topicPopularValidators.js'
import * as ctrl from '../../controllers/admin/topicController.js'
import * as popularCtrl from '../../controllers/admin/topicPopularController.js'

const router = express.Router()

// 접근: ADMIN/SUPERADMIN
router.use(requireRole(['ADMIN', 'SUPERADMIN']))

// GET /api/admin/topics/popular   (TMDB 스냅샷 기반 전체인기작)
router.get('/popular', popularV.getPopularSnapshotValidator, popularCtrl.getPopularSnapshot)

// GET /api/admin/topics
router.get('/', v.listTopicsValidator, ctrl.listTopics)

// POST /api/admin/topics
router.post('/', v.createTopicValidator, ctrl.createTopic)

// PATCH /api/admin/topics/:topic_id
router.patch('/:topic_id', v.updateTopicValidator, ctrl.updateTopic)

// DELETE /api/admin/topics/:topic_id
router.delete('/:topic_id', v.topicIdParamValidator, ctrl.deleteTopic)

// GET /api/admin/topics/:topic_id/comments
router.get('/:topic_id/comments', v.listTopicCommentsValidator, ctrl.listTopicComments)

export default router
