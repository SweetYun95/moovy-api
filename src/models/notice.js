// moovy-api/src/models/notice.js
import { Model, DataTypes } from 'sequelize'

export default class Notice extends Model {
   static init(sequelize) {
      return super.init(
         {
            notice_id: {
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
            modelName: 'Notice',
            tableName: 'notices',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      Notice.hasMany(db.NoticeImage, {
         foreignKey: 'notice_id',
         sourceKey: 'notice_id',
      })
      Notice.belongsTo(db.AdminUser, {
         foreignKey: 'admin_id',
         targetKey: 'admin_id',
      })
   }
}
