// moovy-api/src/controllers/admin/topicPopularController.js
import * as svc from '../../services/admin/topicPopularService.js'

// GET /api/admin/topics/popular
export const getPopularSnapshot = async (req, res, next) => {
   try {
      const q = req.validated?.query ?? req.query ?? {}
      const data = await svc.getPopularSnapshot(q)
      res.json({ success: true, data })
   } catch (e) {
      next(e)
   }
}
