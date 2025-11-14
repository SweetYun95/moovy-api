// moovy-api/src/validations/validators/admin/authValidators.js
import { validate } from '../validate.js'
import { signInSchema, signUpSchema, withdrawSchema } from '../../schemas/admin/authSchemas.js'

// 각 라우트에 바로 넣어서 쓰기 좋은 형태로 export
export const signInValidator = validate({ body: signInSchema })
export const signUpValidaotr = validate({ body: signUpSchema })
export const deleteValidator = validate({ params: withdrawSchema })
