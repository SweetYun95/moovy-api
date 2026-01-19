// moovy-api/src/services/admin/topicPopularService.js
import db from '../../models/index.js'
import { fn, col } from 'sequelize'

const { PopularMovieSnapshot, VideoContent } = db

export const getPopularSnapshot = async ({ source, date, limit }) => {
   const useSource = source || process.env.SNAPSHOT_SOURCE || 'TMDB_TRENDING_DAILY'

   // date 없으면 최신 snapshot_date
   let snapshotDate = date
   if (!snapshotDate) {
      const row = await PopularMovieSnapshot.findOne({
         where: { source: useSource },
         attributes: [[fn('MAX', col('snapshot_date')), 'max_date']],
         raw: true,
      })
      snapshotDate = row?.max_date
   }

   if (!snapshotDate) {
      const err = new Error('인기 스냅샷 데이터가 없습니다.')
      err.status = 404
      throw err
   }

   const rows = await PopularMovieSnapshot.findAll({
      where: {
         source: useSource,
         snapshot_date: snapshotDate,
      },
      include: [
         {
            model: VideoContent,
            attributes: ['content_id', 'tmdb_id', 'title', 'plot', 'poster_path', 'backdrop_path', 'release_date', 'genre', 'views'],
         },
      ],
      order: [['rank', 'ASC']],
      limit: Number(limit || 20),
   })

   const items = rows.map((r) => ({
      rank: r.rank,
      content: r.VideoContent
         ? {
              content_id: r.VideoContent.content_id,
              tmdb_id: r.VideoContent.tmdb_id,
              title: r.VideoContent.title,
              plot: r.VideoContent.plot,
              poster_path: r.VideoContent.poster_path,
              backdrop_path: r.VideoContent.backdrop_path,
              release_date: r.VideoContent.release_date,
              genre: r.VideoContent.genre,
              views: r.VideoContent.views,
           }
         : null,
   }))

   return {
      snapshot_date: snapshotDate,
      source: useSource,
      items,
   }
}
