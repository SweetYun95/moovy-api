// moovy-api/src/models/faq_image.js
import { Model, DataTypes } from 'sequelize'

export default class FaqImage extends Model {
   static init(sequelize) {
      return super.init(
         {
            image_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            faq_id: {
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
            modelName: 'FaqImage',
            tableName: 'faq_images',
            timestamps: false,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      FaqImage.belongsTo(db.Faq, {
         foreignKey: 'faq_id',
         targetKey: 'faq_id',
         onDelete: 'CASCADE',
      })
   }
}
