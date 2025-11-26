// moovy-api/src/swagger.js
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { swaggerPaths } from './routes_swagger/index.js'

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
      paths: swaggerPaths,
   },
   apis: [],
}

export const swaggerSpec = swaggerJSDoc(options)
export { swaggerUi }
