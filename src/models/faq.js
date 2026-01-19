// moovy-api/src/models/faq.js
import { Model, DataTypes } from 'sequelize'

export default class Faq extends Model {
   static init(sequelize) {
      return super.init(
         {
            faq_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            admin_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            title: {
               type: DataTypes.STRING(255),
               allowNull: false,
            },
            content: {
               type: DataTypes.STRING(255),
               allowNull: false,
            },
         },
         {
            sequelize,
            modelName: 'Faq',
            tableName: 'faqs',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      Faq.hasMany(db.FaqImage, {
         foreignKey: 'faq_id',
         sourceKey: 'faq_id',
      })
      Faq.belongsTo(db.AdminUser, {
         foreignKey: 'admin_id',
         targetKey: 'admin_id',
      })
   }
}
