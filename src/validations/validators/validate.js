// moovy-api/src/validations/validators/validate.js
// zod 스키마를 라우트에서 간단히 쓰기 위한 래퍼
import { ZodError } from 'zod'

/**
 * validate({ body, params, query })
 *  - 각 키에 zod 스키마를 넣으면 해당 파트를 검증합니다.
 *  - 파싱 결과는 req.validated.{body|params|query} 에 담아 전달합니다.
 */
export const validate =
   (schemas = {}) =>
   (req, res, next) => {
      try {
         const out = {}
         if (schemas.body) out.body = schemas.body.parse(req.body)
         if (schemas.params) out.params = schemas.params.parse(req.params)
         if (schemas.query) out.query = schemas.query.parse(req.query)
         req.validated = out
         next()
      } catch (e) {
         if (e instanceof ZodError) {
            return res.status(400).json({
               message: 'VALIDATION_ERROR',
               errors: e.flatten(),
            })
         }
         next(e)
      }
   }
