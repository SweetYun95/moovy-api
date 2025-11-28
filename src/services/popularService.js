// moovy-api/src/services/popularService.js
import db from '../models/index.js'
import dayjs from 'dayjs'
import { Op } from 'sequelize'

const DEFAULT_SOURCE = 'TMDB_TRENDING'

export const getPopularMoviesForToday = async () => {
   const today = dayjs().format('YYYY-MM-DD')
   return getPopularMoviesByDate({ date: today, source: DEFAULT_SOURCE })
}

export const getPopularMoviesByDate = async ({ date, source = DEFAULT_SOURCE }) => {
   const rows = await db.PopularMovieSnapshot.findAll({
      where: {
         snapshot_date: date,
         source,
      },
      include: [
         {
            model: db.VideoContent,
            attributes: ['content_id', 'tmdb_id', 'title', 'release_date', 'genre', 'time', 'age_limit', 'plot', 'poster_path', 'backdrop_path'],
         },
      ],
      order: [['rank', 'ASC']],
   })

   // 프론트에서 쓰기 좋게 변환
   return rows.map((row) => ({
      rank: row.rank,
      snapshot_date: row.snapshot_date,
      source: row.source,
      content: row.VideoContent,
   }))
}
