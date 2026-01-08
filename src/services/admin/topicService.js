// moovy-api/src/services/admin/topicService.js
import db, { sequelize } from '../../models/index.js'
import { Op } from 'sequelize'

const { Topic, VideoContent, CommentTbl, User } = db

const getNow = () => new Date()

export const listTopics = async ({ main, filter, page, size, sort, order }) => {
   const limit = Number(size || 20)
   const offset = (Number(page || 1) - 1) * limit

   const now = getNow()
   const where = {}

   // main tab
   if (main === 'current') where.end_at = { [Op.gte]: now }
   if (main === 'past') where.end_at = { [Op.lt]: now }

   // filter tab
   if (filter === 'showing') {
      where.start_at = { [Op.lte]: now }
      where.end_at = { [Op.gte]: now }
   }

   // ✅ topics에 컬럼이 있을 때만 의미 있음 (없으면 where에 넣으면 SQL 에러 날 수 있음)
   // 프로젝트 상황에 맞춰 주석 해제/삭제
   if (filter === 'recommended') {
      where.is_admin_recommended = true
   }

   // 정렬
   const orderBy = []
   if (filter === 'popular' || sort === 'views') {
      orderBy.push([VideoContent, 'views', order || 'DESC'])
   } else {
      orderBy.push([sort || 'start_at', order || 'DESC'])
   }

   const result = await Topic.findAndCountAll({
      where,
      include: [
         {
            model: VideoContent,
            attributes: ['content_id', 'tmdb_id', 'title', 'plot', 'poster_path', 'backdrop_path', 'views', 'genre', 'release_date'],
         },
      ],
      order: orderBy,
      limit,
      offset,
   })

   const items = result.rows.map((t) => ({
      topic_id: t.topic_id,
      content_id: t.content_id,
      start_at: t.start_at,
      end_at: t.end_at,
      is_admin_recommended: t.is_admin_recommended ?? false,
      video: t.VideoContent
         ? {
              content_id: t.VideoContent.content_id,
              tmdb_id: t.VideoContent.tmdb_id,
              title: t.VideoContent.title,
              synopsis: t.VideoContent.plot,
              poster_path: t.VideoContent.poster_path,
              backdrop_path: t.VideoContent.backdrop_path,
              views: t.VideoContent.views,
              genre: t.VideoContent.genre,
              release_date: t.VideoContent.release_date,
           }
         : null,
   }))

   return {
      data: {
         items,
         page: Number(page || 1),
         size: limit,
         total: result.count,
      },
   }
}

export const createTopic = async ({ content_id, start_at, end_at, is_admin_recommended }) => {
   const tx = await sequelize.transaction()
   try {
      if (new Date(start_at) > new Date(end_at)) {
         const err = new Error('start_at은 end_at보다 늦을 수 없습니다.')
         err.status = 400
         throw err
      }

      const content = await VideoContent.findByPk(content_id, { transaction: tx })
      if (!content) {
         const err = new Error('content_id에 해당하는 콘텐츠가 없습니다.')
         err.status = 404
         throw err
      }

      const payload = { content_id, start_at, end_at }

      // ✅ 컬럼이 실제로 있을 때만 넣는게 안전
      if (typeof is_admin_recommended !== 'undefined') payload.is_admin_recommended = !!is_admin_recommended

      const topic = await Topic.create(payload, { transaction: tx })

      await tx.commit()
      return { topic_id: topic.topic_id }
   } catch (e) {
      await tx.rollback()
      throw e
   }
}

export const updateTopic = async (topicId, body) => {
   const tx = await sequelize.transaction()
   try {
      const topic = await Topic.findByPk(topicId, { transaction: tx, lock: tx.LOCK.UPDATE })
      if (!topic) {
         const err = new Error('토픽을 찾지 못했습니다.')
         err.status = 404
         throw err
      }

      const nextStart = body.start_at ?? topic.start_at
      const nextEnd = body.end_at ?? topic.end_at
      if (new Date(nextStart) > new Date(nextEnd)) {
         const err = new Error('start_at은 end_at보다 늦을 수 없습니다.')
         err.status = 400
         throw err
      }

      const payload = {
         ...(body.start_at ? { start_at: body.start_at } : {}),
         ...(body.end_at ? { end_at: body.end_at } : {}),
      }

      // ✅ 컬럼이 실제로 있을 때만 넣는게 안전
      if (body.is_admin_recommended !== undefined) payload.is_admin_recommended = !!body.is_admin_recommended

      await topic.update(payload, { transaction: tx })

      await tx.commit()
      return { topic_id: topic.topic_id }
   } catch (e) {
      await tx.rollback()
      throw e
   }
}

export const deleteTopic = async (topicId) => {
   const tx = await sequelize.transaction()
   try {
      const topic = await Topic.findByPk(topicId, { transaction: tx, lock: tx.LOCK.UPDATE })
      if (!topic) {
         const err = new Error('토픽을 찾지 못했습니다.')
         err.status = 404
         throw err
      }

      await topic.destroy({ transaction: tx }) // paranoid면 soft delete

      await tx.commit()
      return { topic_id: topicId }
   } catch (e) {
      await tx.rollback()
      throw e
   }
}

export const listTopicComments = async (topicId, { page, size, q, order }) => {
   const limit = Number(size || 20)
   const offset = (Number(page || 1) - 1) * limit

   // topic 존재 확인
   const topic = await Topic.findByPk(topicId)
   if (!topic) {
      const err = new Error('토픽을 찾지 못했습니다.')
      err.status = 404
      throw err
   }

   const where = { topic_id: topicId }
   if (q) where.content = { [Op.like]: `%${q}%` }

   const result = await CommentTbl.findAndCountAll({
      where,
      include: [
         {
            model: User,
            attributes: ['user_id', 'name', 'email'], // User 모델 필드에 맞게 조정
         },
      ],
      order: [['created_at', order || 'DESC']],
      limit,
      offset,
   })

   const items = result.rows.map((c) => ({
      comment_id: c.comment_id,
      topic_id: c.topic_id,
      user_id: c.user_id,
      content: c.content,
      created_at: c.created_at,
      user: c.User ? { user_id: c.User.user_id, name: c.User.name, email: c.User.email } : null,
   }))

   return {
      data: {
         items,
         page: Number(page || 1),
         size: limit,
         total: result.count,
      },
   }
}
