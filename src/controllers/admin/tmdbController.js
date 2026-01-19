// moovy-api/src/controllers/admin/tmdbController.js
import * as tmdbService from '../../services/admin/tmdbService.js'

export const searchMovies = async (req, res, next) => {
   try {
      const q = (req.query.q ?? '').toString().trim()
      const pageRaw = req.query.page
      const page = pageRaw ? Number(pageRaw) : 1

      if (!q) {
         return res.status(400).json({
            success: false,
            message: "Query parameter 'q' is required.",
         })
      }
      if (Number.isNaN(page) || page < 1) {
         return res.status(400).json({
            success: false,
            message: "Query parameter 'page' must be a positive number.",
         })
      }

      const data = await tmdbService.searchMovies({ q, page })
      return res.json({ success: true, data })
   } catch (err) {
      next(err)
   }
}

export const getMovieDetail = async (req, res, next) => {
   try {
      const tmdbIdRaw = req.params.tmdb_id
      const tmdb_id = Number(tmdbIdRaw)

      if (Number.isNaN(tmdb_id) || tmdb_id < 1) {
         return res.status(400).json({
            success: false,
            message: "Param 'tmdb_id' must be a positive number.",
         })
      }

      const data = await tmdbService.getMovieDetail({ tmdb_id })
      return res.json({ success: true, data })
   } catch (err) {
      next(err)
   }
}
