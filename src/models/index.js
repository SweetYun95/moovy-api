// moovy-api/src/models/index.js
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import cfg from '../config/config.js'

// 각 모델 (기본 포맷)
import User from './user.js'

dotenv.config()
const env = process.env.NODE_ENV || 'development'
const config = cfg[env]

const sequelize = new Sequelize(config.database, config.username, config.password, config)

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
