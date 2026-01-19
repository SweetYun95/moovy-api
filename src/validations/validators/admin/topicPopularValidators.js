// moovy-api/src/validations/validators/admin/topicPopularValidators.js
import { validate } from '../validate.js'
import { getPopularSnapshotQuerySchema } from '../../schemas/admin/topicPopularSchema.js'

export const getPopularSnapshotValidator = validate({ query: getPopularSnapshotQuerySchema })
