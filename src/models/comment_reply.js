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
            contnet: {
               type: DataTypes.TEXT,
               allowNull: false,
            },
         },
         {
            sequelize,
            modelName: 'CommentReply',
            tableName: 'comment_replys',
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
      CommentReply.belongsTo(db.CommentReplyReport, {
         foreignKey: 'reply_id',
         targetKey: 'reply_id',
         onDelete: 'CASCADE',
      })
   }
}
