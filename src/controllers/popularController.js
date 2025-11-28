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
      const { date, source } = req.query
      const data = await popularService.getPopularMoviesByDate({ date, source })
      res.json({ success: true, data })
   } catch (err) {
      next(err)
   }
}
