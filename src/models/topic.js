// moovy-api/src/models/topic.js
import { Model, DataTypes } from 'sequelize'

export default class Topic extends Model {
   static init(sequelize) {
      return super.init(
         {
            topic_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            content_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            is_admin_recommended: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: false,
            },
            start_at: {
               type: DataTypes.DATE,
               allowNull: false,
            },
            end_at: {
               type: DataTypes.DATE,
               allowNull: false,
            },
         },
         {
            sequelize,
            modelName: 'Topic',
            tableName: 'topics',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      Topic.belongsTo(db.VideoContent, {
         foreignKey: 'content_id',
         sourceKey: 'content_id',
      })
      Topic.hasMany(db.CommentTbl, {
         foreignKey: 'topic_id',
         sourceKey: 'topic_id',
      })
   }
}
