// moovy-api/src/validations/dto/commonDto.js
export const normalizePagination = (q) => {
   const page = Math.max(1, Number(q.page ?? 1))
   const limit = Math.min(50, Math.max(1, Number(q.limit ?? 10)))
   const offset = (page - 1) * limit
   return { page, limit, offset }
}
