// moovy-api/src/models/index.js
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import cfg from '../config/config.cjs'

// 각 모델 (기본 포맷)
import User from './user.js'

dotenv.config()

const env = process.env.NODE_ENV || 'development'
const cfg = {
   username: env === 'test' ? process.env.TEST_DB_USERNAME : process.env.DB_USERNAME,
   password: env === 'test' ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
   database: env === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME,
   host: env === 'test' ? process.env.TEST_DB_HOST : process.env.DB_HOST,
   dialect: (env === 'test' ? process.env.TEST_DB_DIALECT : process.env.DB_DIALECT) || 'mysql',
   logging: env === 'development' ? console.log : false,
}

const sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, cfg)

const db = {
   sequelize,
   Sequelize,
   User,
}

// --- Initialize ---
User.init(sequelize)

// --- Associate ---
User.associate?.(db)

export default db
export { sequelize, Sequelize }
