// moovy-api/src/models/index.js
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import cfg from "../config/config.js";

// 각 모델 (기본 포맷)
import AdminUser from "./admin_user.js";
import CommentReply from "./comment_reply.js";
import CommentReplyReport from "./comment_reply_report.js";
import CommentTbl from "./comment_tbl.js";
import CommentReport from "./comment_report.js";
import Faq from "./faq.js";
import FaqImage from "./faq_image.js";
import Favorite from "./favorite.js";
import Notice from "./notice.js";
import NoticeImage from "./notice_image.js";
import Qna from "./qna.js";
import QnaImage from "./qna_image.js";
import Rating from "./rating.js";
import SystemKeyValue from "./system_keyvalue.js";
import Topic from "./topic.js";
import User from "./user.js";
import UserDetail from "./user_detail.js";
import UserSanction from "./user_sanction.js";
import VideoContent from "./video_content.js";
import VideoContentImage from "./video_content_image.js";

dotenv.config();
const env = process.env.NODE_ENV || "development";
const config = cfg[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    // logging: false, // ✅ SQL 로그 출력 끄기
  }
);

const db = {
  sequelize,
  Sequelize,
  AdminUser,
  CommentReply,
  CommentReplyReport,
  CommentTbl,
  CommentReport,
  Faq,
  FaqImage,
  Favorite,
  Notice,
  NoticeImage,
  Qna,
  QnaImage,
  Rating,
  SystemKeyValue,
  Topic,
  User,
  UserDetail,
  UserSanction,
  VideoContent,
  VideoContentImage,
};

// --- Initialize all models ---
Object.values(db)
  .filter((model) => typeof model.init === "function")
  .forEach((model) => model.init(sequelize));

// --- Associate all models ---
Object.values(db)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(db));

export default db;
export { sequelize, Sequelize };
