// moovy-api/src/models/notice_image.js
import { Model, DataTypes } from 'sequelize'

export default class NoticeImage extends Model {
   static init(sequelize) {
      return super.init(
         {
            image_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            notice_id: {
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
            modelName: 'NoticeImage',
            tableName: 'notice_images',
            timestamps: false,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      NoticeImage.belongsTo(db.Notice, {
         foreignKey: 'notice_id',
         targetKey: 'notice_id',
         onDelete: 'CASCADE',
      })
   }
}
