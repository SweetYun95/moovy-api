// moovy-api/src/controllers/admin/reportsController.js

import * as reportsService from '../../services/admin/reportsService.js'

export const getList = async (req, res, next) => {
   try {
      const { page, limit, ...filters } = req.validated?.query || req.query || {}
      const data = await reportsService.getList(page, limit, filters)
      res.json({ success: true, data })
   } catch (e) {
      next(e)
   }
}

export const getDetail = async (req, res, next) => {
   try {
      const { type, report_id } = req.validated?.params || req.params
      const item = await reportsService.getDetail(type, report_id)
      if (!item) {
         const err = new Error('신고 내역을 찾을 수 없습니다.')
         err.status = 404
         throw err
      }
      res.json({ success: true, data: item })
   } catch (e) {
      next(e)
   }
}

export const complete = async (req, res, next) => {
   try {
      const { type, report_id } = req.validated?.params || req.params
      const { action } = req.validated?.query || req.query || {}
      const result = await reportsService.complete(type, report_id, action)
      if (!result) {
         const err = new Error('신고 내역을 찾을 수 없습니다.')
         err.status = 404
         throw err
      }
      res.json({ success: true, data: result })
   } catch (e) {
      next(e)
   }
}
