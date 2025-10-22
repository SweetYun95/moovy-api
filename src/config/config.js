// moovy-api/src/config/config.js
import dotenv from 'dotenv'
dotenv.config()

const TZ = '+09:00'
const fallbackDialect = 'mysql'

export default {
   development: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT || fallbackDialect,
      timezone: TZ,
   },
   test: {
      username: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
      host: process.env.TEST_DB_HOST,
      dialect: process.env.TEST_DB_DIALECT || fallbackDialect,
      timezone: TZ,
   },
   production: {
      username: process.env.DEPLOY_DB_USERNAME,
      password: process.env.DEPLOY_DB_PASSWORD,
      database: process.env.DEPLOY_DB_NAME,
      host: process.env.DEPLOY_DB_HOST,
      dialect: process.env.DEPLOY_DB_DIALECT || fallbackDialect,
      logging: false,
      timezone: TZ,
      // dialectOptions: { ssl: { require: true } }, // 필요 시 주석 해제
   },
}
