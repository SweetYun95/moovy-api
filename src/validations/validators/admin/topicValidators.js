// moovy-api/src/validations/validators/admin/topicValidators.js
import { validate } from '../validate.js'
import { listTopicsQuerySchema, topicIdParamSchema, createTopicBodySchema, updateTopicBodySchema, listTopicCommentsQuerySchema } from '../../schemas/admin/topicSchema.js'

export const listTopicsValidator = validate({ query: listTopicsQuerySchema })
export const createTopicValidator = validate({ body: createTopicBodySchema })
export const topicIdParamValidator = validate({ params: topicIdParamSchema })
export const updateTopicValidator = validate({ params: topicIdParamSchema, body: updateTopicBodySchema })
export const listTopicCommentsValidator = validate({ params: topicIdParamSchema, query: listTopicCommentsQuerySchema })
