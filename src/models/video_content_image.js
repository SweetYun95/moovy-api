// moovy-api/src/models/video_content_image.js
import { Model, DataTypes } from 'sequelize'

export default class VideoContentImage extends Model {
   static init(sequelize) {
      return super.init(
         {
            image_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            content_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            img_url: {
               type: DataTypes.TEXT,
               allowNull: false,
            },
            order: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
         },
         {
            sequelize,
            modelName: 'VideoContentImage',
            tableName: 'video_content_images',
            timestamps: false,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      VideoContentImage.belongsTo(db.VideoContent, {
         foreignKey: 'content_id',
         targetKey: 'content_id',
         onDelete: 'CASCADE',
      })
   }
}
