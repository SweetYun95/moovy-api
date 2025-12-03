// moovy-api/src/controllers/popularController.js
import * as popularService from '../services/popularService.js'

export const getTodayPopularMovies = async (req, res, next) => {
   try {
      const data = await popularService.getPopularMoviesForToday()
      res.json({ success: true, data })
   } catch (err) {
      next(err)
   }
}

export const getPopularMoviesByDate = async (req, res, next) => {
   try {
      const query = req.validated?.query ?? req.query
      const { date, source } = query
      // Validate date: must be present and in YYYY-MM-DD format
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
         return res.status(400).json({ success: false, error: "Invalid or missing 'date' parameter. Expected format: YYYY-MM-DD." })
      }
      // Optionally, validate source here if needed
      const data = await popularService.getPopularMoviesByDate({ date, source })
      res.json({ success: true, data })
   } catch (err) {
      next(err)
   }
}
