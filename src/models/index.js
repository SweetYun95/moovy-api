// moovy-api/src/models/index.js
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import cfg from '../config/config.js'

/* =========================
 * User / Auth
 * ========================= */
import User from './user.js'
import UserDetail from './user_detail.js'
import UserSanction from './user_sanction.js'
import AdminUser from './admin_user.js'
import PasswordResetToken from './password_reset_token.js'
import AdminHistory from './admin_history.js'

/* =========================
 * Video / Content
 * ========================= */
import VideoContent from './video_content.js'
import VideoContentImage from './video_content_image.js'
import PopularMovieSnapshot from './popular_movie_snapshot.js'

/* =========================
 * Topic / Comment
 * ========================= */
import Topic from './topic.js'
import CommentTbl from './comment_tbl.js'
import CommentReply from './comment_reply.js'
import CommentReport from './comment_report.js'
import CommentReplyReport from './comment_reply_report.js'

/* =========================
 * Like / Rating
 * ========================= */
import Favorite from './favorite.js'
import CommentLike from './comment_like.js'
import ReplyLike from './reply_like.js'
import Rating from './rating.js'

/* =========================
 * Board / Support
 * ========================= */
import Notice from './notice.js'
import NoticeImage from './notice_image.js'
import Qna from './qna.js'
import QnaImage from './qna_image.js'
import Faq from './faq.js'
import FaqImage from './faq_image.js'

/* =========================
 * System
 * ========================= */
import SystemKeyValue from './system_keyvalue.js'

dotenv.config()
const env = process.env.NODE_ENV || 'development'
const config = cfg[env]

const sequelize = new Sequelize(config.database, config.username, config.password, {
   ...config,
   // logging: false,
})

const db = {
   sequelize,
   Sequelize,

   // User / Auth
   User,
   UserDetail,
   UserSanction,
   AdminUser,
   PasswordResetToken,
   AdminHistory,

   // Video / Content
   VideoContent,
   VideoContentImage,
   PopularMovieSnapshot,

   // Topic / Comment
   Topic,
   CommentTbl,
   CommentReply,
   CommentReport,
   CommentReplyReport,

   // Like / Rating
   Favorite,
   CommentLike,
   ReplyLike,
   Rating,

   // Board / Support
   Notice,
   NoticeImage,
   Qna,
   QnaImage,
   Faq,
   FaqImage,

   // System
   SystemKeyValue,
}

// --- Initialize all models ---
Object.values(db)
   .filter((model) => typeof model.init === 'function')
   .forEach((model) => model.init(sequelize))

// --- Associate all models ---
Object.values(db)
   .filter((model) => typeof model.associate === 'function')
   .forEach((model) => model.associate(db))

export default db
export { sequelize, Sequelize }
