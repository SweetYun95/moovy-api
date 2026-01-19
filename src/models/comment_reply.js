// moovy-api/src/models/comment_reply.js
import { Model, DataTypes } from 'sequelize'

export default class CommentReply extends Model {
   static init(sequelize) {
      return super.init(
         {
            reply_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            comment_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            user_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            content: {
               type: DataTypes.TEXT,
               allowNull: false,
            },
         },
         {
            sequelize,
            modelName: 'CommentReply',
            tableName: 'comment_replies',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      CommentReply.belongsTo(db.CommentTbl, {
         foreignKey: 'comment_id',
         targetKey: 'comment_id',
         onDelete: 'CASCADE',
      })
      CommentReply.belongsTo(db.User, {
         foreignKey: 'user_id',
         targetKey: 'user_id',
         onDelete: 'CASCADE',
      })
      CommentReply.hasMany(db.CommentReplyReport, {
         foreignKey: 'reply_id',
         sourceKey: 'reply_id',
      })
      CommentReply.hasMany(db.ReplyLike, {
         foreignKey: 'reply_id',
         sourceKey: 'reply_id',
      })
   }
}
