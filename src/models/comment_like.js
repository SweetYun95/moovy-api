// moovy-api/src/models/comment_like.js
import { Model, DataTypes } from 'sequelize'

export default class CommentLike extends Model {
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
            comment_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
         },
         {
            sequelize,
            modelName: 'CommentLike',
            tableName: 'comment_likes',
            timestamps: true,
            paranoid: false, // 좋아요 취소는 row 삭제로 처리(단순/정석)
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            indexes: [
               {
                  unique: true,
                  fields: ['user_id', 'comment_id'], // 한 유저가 같은 댓글에 중복 좋아요 방지
               },
            ],
         }
      )
   }

   static associate(db) {
      CommentLike.belongsTo(db.User, {
         foreignKey: 'user_id',
         targetKey: 'user_id',
         onDelete: 'CASCADE',
      })
      CommentLike.belongsTo(db.CommentTbl, {
         foreignKey: 'comment_id',
         targetKey: 'comment_id',
         onDelete: 'CASCADE',
      })
   }
}
