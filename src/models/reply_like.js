// moovy-api/src/models/reply_like.js
import { Model, DataTypes } from 'sequelize'

export default class ReplyLike extends Model {
   static init(sequelize) {
      return super.init(
         {
            id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            user_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            reply_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
         },
         {
            sequelize,
            modelName: 'ReplyLike',
            tableName: 'reply_likes',
            timestamps: true,
            paranoid: false, // 좋아요 취소는 row 삭제로 처리(단순/정석)
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            indexes: [
               {
                  unique: true,
                  fields: ['user_id', 'reply_id'], // 한 유저가 같은 대댓글에 중복 좋아요 방지
               },
            ],
         }
      )
   }

   static associate(db) {
      ReplyLike.belongsTo(db.User, {
         foreignKey: 'user_id',
         targetKey: 'user_id',
         onDelete: 'CASCADE',
      })
      ReplyLike.belongsTo(db.CommentReply, {
         foreignKey: 'reply_id',
         targetKey: 'reply_id',
         onDelete: 'CASCADE',
      })
   }
}
