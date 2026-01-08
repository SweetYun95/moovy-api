// moovy-api/src/controllers/admin/dashboardController.js
import * as svc from '../../services/admin/dashboardService.js'

export const getDashboard = async (req, res, next) => {
   try {
      const q = req.validated?.query ?? req.query ?? {}
      const year = q.year ? Number(q.year) : new Date().getFullYear()
      const topN = q.topN ? Number(q.topN) : 9

      const data = await svc.getDashboard({ year, topN })
      res.json(data)
   } catch (e) {
      next(e)
   }
}
