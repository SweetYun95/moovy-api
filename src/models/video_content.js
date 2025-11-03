// moovy-api/src/models/video_content.js
import { Model, DataTypes } from 'sequelize'

export default class VideoContent extends Model {
   static init(sequelize) {
      return super.init(
         {
            content_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            title: {
               type: DataTypes.STRING(100),
               allowNull: false,
            },
            release_date: {
               type: DataTypes.DATE,
            },
            genre: {
               type: DataTypes.STRING(30),
            },
            time: {
               type: DataTypes.INTEGER,
            },
            age_limit: {
               type: DataTypes.INTEGER,
            },
            plot: {
               type: DataTypes.TEXT,
            },
         },
         {
            sequelize,
            modelName: 'VideoContent',
            tableName: 'video_contents',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      VideoContent.hasMany(db.VideoContentImage, {
         foreignKey: 'content_id',
         sourceKey: 'content_id',
      })
      VideoContent.hasMany(db.Favorite, {
         foreignKey: 'content_id',
         targetKey: 'content_id',
      })
      VideoContent.belongsToMany(db.User, {
         foreignKey: 'content_id',
         otherKey: 'user_id',
         through: db.Favorite,
      })

      VideoContent.hasMany(db.Rating, {
         foreignKey: 'content_id',
         targetKey: 'content_id',
      })
      VideoContent.belongsToMany(db.User, {
         foreignKey: 'content_id',
         otherKey: 'user_id',
         through: db.Rating,
      })

      VideoContent.belongsTo(db.Topic, {
         foreignKey: 'content_id',
         sourceKey: 'content_id',
      })
   }
}
