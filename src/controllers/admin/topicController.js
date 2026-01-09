// moovy-api/src/controllers/admin/topicController.js
import * as svc from '../../services/admin/topicService.js'

// GET /api/admin/topics
export const listTopics = async (req, res, next) => {
   try {
      const q = req.validated?.query ?? req.query ?? {}
      const data = await svc.listTopics(q)
      res.json({ success: true, ...data })
   } catch (e) {
      next(e)
   }
}

// POST /api/admin/topics
export const createTopic = async (req, res, next) => {
   try {
      const body = req.validated?.body ?? req.body ?? {}
      const data = await svc.createTopic(body)
      res.status(201).json({ success: true, data })
   } catch (e) {
      next(e)
   }
}

// PATCH /api/admin/topics/:topic_id
export const updateTopic = async (req, res, next) => {
   try {
      const { topic_id } = req.validated?.params ?? req.params
      const body = req.validated?.body ?? req.body ?? {}
      const data = await svc.updateTopic(Number(topic_id), body)
      res.json({ success: true, data })
   } catch (e) {
      next(e)
   }
}

// DELETE /api/admin/topics/:topic_id
export const deleteTopic = async (req, res, next) => {
   try {
      const { topic_id } = req.validated?.params ?? req.params
      const data = await svc.deleteTopic(Number(topic_id))
      res.json({ success: true, data })
   } catch (e) {
      next(e)
   }
}

// GET /api/admin/topics/:topic_id/comments
export const listTopicComments = async (req, res, next) => {
   try {
      const { topic_id } = req.validated?.params ?? req.params
      const q = req.validated?.query ?? req.query ?? {}
      const data = await svc.listTopicComments(Number(topic_id), q)
      res.json({ success: true, ...data })
   } catch (e) {
      next(e)
   }
}
