// moovy-api/src/models/comment_tbl.js
import { Model, DataTypes } from 'sequelize'

export default class CommentTbl extends Model {
   static init(sequelize) {
      return super.init(
         {
            comment_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            topic_id: {
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
            modelName: 'CommentTbl',
            tableName: 'comment_tbls',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      CommentTbl.belongsTo(db.Topic, {
         foreignKey: 'topic_id',
         targetKey: 'topic_id',
         onDelete: 'CASCADE',
      })
      CommentTbl.belongsTo(db.User, {
         foreignKey: 'user_id',
         targetKey: 'user_id',
         onDelete: 'CASCADE',
      })
      CommentTbl.hasMany(db.CommentReply, {
         foreignKey: 'comment_id',
         sourceKey: 'comment_id',
      })
      CommentTbl.hasMany(db.CommentReport, {
         foreignKey: 'comment_id',
         sourceKey: 'comment_id',
      })
   }
}
