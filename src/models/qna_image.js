// moovy-api/src/models/qna_image.js
import { Model, DataTypes } from 'sequelize'

export default class QnaImage extends Model {
   static init(sequelize) {
      return super.init(
         {
            image_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            qna_id: {
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
            modelName: 'QnaImage',
            tableName: 'qna_images',
            timestamps: false,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      QnaImage.belongsTo(db.Qna, {
         foreignKey: 'qna_id',
         targetKey: 'qna_id',
         onDelete: 'CASCADE',
      })
   }
}
