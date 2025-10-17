// moovy-api/src/swagger.js
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

// ⚠️ Windows 경로 문제 피하려고 glob은 POSIX 경로 문자열 그대로 사용
const options = {
   definition: {
      openapi: '3.0.0',
      info: { title: 'moovy API', version: '1.0.0', description: 'moovy API 문서입니다.' },
      servers: [{ url: process.env.APP_API_URL || 'http://localhost:8000' }],
      components: {
         securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
         },
      },
      security: [{ bearerAuth: [] }],
   },
   apis: ['src/routes_swagger/**/*.swagger.js'], // 아직 파일 없어도 OK
}

export const swaggerSpec = swaggerJSDoc(options)
export { swaggerUi }
