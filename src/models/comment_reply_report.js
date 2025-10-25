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
               defaultValue: 'OTHER',
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
      CommentReplyReport.belongsTo(db.User, {
         foreignKey: 'reporter_id',
         targetKey: 'user_id',
         as: 'reporter',
         onDelete: 'CASCADE',
      })
      CommentReplyReport.belongsTo(db.User, {
         foreignKey: 'reported_id',
         targetKey: 'user_id',
         as: 'reported',
         onDelete: 'CASCADE',
      })
      CommentReplyReport.belongsTo(db.CommentReply, {
         foreignKey: 'reply_id',
         targetKey: 'reply_id',
         onDelete: 'CASCADE',
      })
   }
}
