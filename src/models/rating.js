// moovy-api/src/models/rating.js
import { Model, DataTypes } from 'sequelize'

export default class Rating extends Model {
   static init(sequelize) {
      return super.init(
         {
            id: {
               type: DataTypes.INTEGER,
               primaryKey: true,
               autoIncrement: true,
            },
            user_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               references: {
                  model: 'users',
                  key: 'user_id',
               },
               onDelete: 'CASCADE',
               onUpdate: 'CASCADE',
            },
            content_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               references: {
                  model: 'video_contents',
                  key: 'content_id',
               },
               onDelete: 'CASCADE',
               onUpdate: 'CASCADE',
            },
            point: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
         },
         {
            sequelize,
            modelName: 'Rating',
            tableName: 'ratings',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      Rating.belongsTo(db.VideoContent, {
         foreignKey: 'content_id',
         targetKey: 'content_id',
      })
      Rating.belongsTo(db.User, {
         foreignKey: 'user_id',
         targetKey: 'user_id',
         onDelete: 'CASCADE',
      })
   }
}
