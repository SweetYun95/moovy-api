// moovy-api/src/controllers/topicController.js
import db from '../models/index.js'
import dayjs from 'dayjs'
import { normalizePagination } from '../validations/dto/commonDto.js'

const { Topic, VideoContent, CommentTbl } = db

// 토픽 목록
export const listTopics = async (req, res) => {
   try {
      const { main = 'current' } = req.query
      const { limit, offset, page } = normalizePagination(req.query)

      const now = new Date()

      // main 필터
      const where = {}
      if (main === 'current') {
         where.start_at = { [db.Sequelize.Op.lte]: now }
         where.end_at = { [db.Sequelize.Op.gte]: now }
      } else if (main === 'past') {
         where.end_at = { [db.Sequelize.Op.lt]: now }
      } else if (main === 'all') {
         // no-op
      } else {
         return res.status(400).json({ message: "main 파라미터는 'current' | 'past' | 'all' 만 허용됩니다." })
      }

      const { rows, count } = await Topic.findAndCountAll({
         where,
         include: [
            {
               model: VideoContent,
               attributes: ['content_id', 'tmdb_id', 'title', 'release_date', 'poster_path', 'backdrop_path', 'views'],
            },
         ],
         order: [
            ['start_at', 'DESC'],
            ['topic_id', 'DESC'],
         ],
         limit,
         offset,
      })

      return res.json({
         page,
         limit,
         total: count,
         items: rows,
      })
   } catch (err) {
      return res.status(500).json({ message: '토픽 목록 조회 실패', error: err.message })
   }
}

// 현재 토픽만(별도 엔드포인트)
export const getCurrentTopics = async (_req, res) => {
   try {
      const now = new Date()

      const topics = await Topic.findAll({
         where: {
            start_at: { [db.Sequelize.Op.lte]: now },
            end_at: { [db.Sequelize.Op.gte]: now },
         },
         include: [
            {
               model: VideoContent,
               attributes: ['content_id', 'tmdb_id', 'title', 'release_date', 'poster_path', 'backdrop_path', 'views'],
            },
         ],
         order: [
            ['start_at', 'DESC'],
            ['topic_id', 'DESC'],
         ],
      })

      return res.json(topics)
   } catch (err) {
      return res.status(500).json({ message: '현재 토픽 조회 실패', error: err.message })
   }
}

// 토픽 상세
export const getTopicById = async (req, res) => {
   try {
      const { topic_id } = req.params

      const topic = await Topic.findByPk(topic_id, {
         include: [
            {
               model: VideoContent,
               attributes: ['content_id', 'tmdb_id', 'title', 'release_date', 'genre', 'time', 'age_limit', 'plot', 'poster_path', 'backdrop_path', 'views'],
            },
         ],
      })

      if (!topic) return res.status(404).json({ message: '존재하지 않는 토픽입니다.' })

      // (선택) 댓글 수 같이 주면 프론트가 행복해짐
      const commentCount = await CommentTbl.count({ where: { topic_id } })

      return res.json({
         ...topic.toJSON(),
         comment_count: commentCount,
         // (선택) 현재 진행 여부도 같이 주면 UX 깔끔
         is_active: dayjs().isAfter(dayjs(topic.start_at)) && dayjs().isBefore(dayjs(topic.end_at)),
      })
   } catch (err) {
      return res.status(500).json({ message: '토픽 상세 조회 실패', error: err.message })
   }
}
