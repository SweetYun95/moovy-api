// moovy-api/src/models/comment_reply_report.js
import { Model, DataTypes } from 'sequelize'

export default class CommentReplyReport extends Model {
   static init(sequelize) {
      return super.init(
         {
            report_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            reporter_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            reported_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            reply_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            report_type: {
               type: DataTypes.ENUM('OTHER', 'SPAM', 'SPOILER', 'ABUSE', 'HARASSMENT'),
               allowNull: false,
               defaultValue: 'OTHER',
            },

            // ✅ 신규: 처리 상태
            state: {
               type: DataTypes.ENUM('PENDING', 'RESOLVED', 'REJECTED'),
               allowNull: false,
               defaultValue: 'PENDING',
            },

            // ✅ 신규: 처리한 관리자 / 처리 시각 / 메모
            handled_by_admin_id: {
               type: DataTypes.INTEGER,
               allowNull: true,
            },
            handled_at: {
               type: DataTypes.DATE,
               allowNull: true,
            },
            note: {
               type: DataTypes.TEXT,
               allowNull: true,
            },
         },
         {
            sequelize,
            modelName: 'CommentReplyReport',
            tableName: 'comment_reply_reports',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      // 신고자
      CommentReplyReport.belongsTo(db.User, {
         foreignKey: 'reporter_id',
         targetKey: 'user_id',
         as: 'reporter',
         onDelete: 'CASCADE',
      })

      // 피신고자
      CommentReplyReport.belongsTo(db.User, {
         foreignKey: 'reported_id',
         targetKey: 'user_id',
         as: 'reported',
         onDelete: 'CASCADE',
      })

      // 신고 대상 답글
      CommentReplyReport.belongsTo(db.CommentReply, {
         foreignKey: 'reply_id',
         targetKey: 'reply_id',
         onDelete: 'CASCADE',
      })

      // ✅ 신규: 처리 관리자(핸들러)
      CommentReplyReport.belongsTo(db.AdminUser, {
         foreignKey: 'handled_by_admin_id',
         targetKey: 'admin_id',
         as: 'handler',
         onDelete: 'SET NULL',
         onUpdate: 'CASCADE',
      })
   }
}
