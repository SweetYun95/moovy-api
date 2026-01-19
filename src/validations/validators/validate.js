// moovy-api/src/validations/validators/validate.js
// zod 스키마를 라우트에서 간단히 쓰기 위한 래퍼
import { z, ZodError } from 'zod'

const toFlatErrorsFromIssues = (issues = []) => {
   const formErrors = []
   const fieldErrors = {}

   for (const issue of issues) {
      const path = Array.isArray(issue?.path) ? issue.path : []
      const message = typeof issue?.message === 'string' ? issue.message : 'Invalid input'

      if (path.length === 0) {
         formErrors.push(message)
         continue
      }

      const key = String(path[0])
      if (!fieldErrors[key]) fieldErrors[key] = []
      fieldErrors[key].push(message)
   }

   return { formErrors, fieldErrors }
}

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
            const tree = z.treeifyError(e)
            const flat = toFlatErrorsFromIssues(e.issues)
            if (process.env.NODE_ENV !== 'production') {
               console.warn(`[VALIDATION_ERROR] ${req.method} ${req.originalUrl}`, tree)
            }
            return res.status(400).json({
               message: 'VALIDATION_ERROR',
               errors: flat,
               tree,
            })
         }
         next(e)
      }
   }
