// moovy-api/src/models/favorite.js
import { Model, DataTypes } from 'sequelize'

export default class Favorite extends Model {
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
         },
         {
            sequelize,
            modelName: 'Favorite',
            tableName: 'favorites',
            timestamps: true,
            paranoid: false,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            indexes: [
               {
                  unique: true,
                  fields: ['user_id', 'content_id'],
               },
            ],
         }
      )
   }

   static associate(db) {
      Favorite.belongsTo(db.VideoContent, {
         foreignKey: 'content_id',
         targetKey: 'content_id',
      })
      Favorite.belongsTo(db.User, {
         foreignKey: 'user_id',
         targetKey: 'user_id',
         onDelete: 'CASCADE',
      })
   }
}
