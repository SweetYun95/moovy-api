// moovy-api/src/controllers/admin/historyController.js
import * as historyService from '../../services/admin/historyService.js'

// 히스토리 목록
export const getList = async (req, res, next) => {
   try {
      const { page = 1, limit = 20, ...filters } = req.validated?.query || req.query
      const result = await historyService.getList(page, limit, filters)
      res.json(result)
   } catch (error) {
      next(error)
   }
}
