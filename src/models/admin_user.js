// moovy-api/src/models/admin_user.js
import { Model, DataTypes, ENUM } from 'sequelize'

export default class AdminUser extends Model {
   static init(sequelize) {
      return super.init(
         {
            admin_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            email: {
               type: DataTypes.STRING(100),
               allowNull: false,
               unique: true,
            },
            password: {
               type: DataTypes.STRING(255),
               allowNull: false,
            },
            name: {
               type: DataTypes.STRING(40),
               allowNull: false,
            },
            role: {
               type: ENUM('SUPERADMIN', 'ADMIN'),
               allowNull: false,
               defaultValue: 'ADMIN',
            },
         },
         {
            sequelize,
            modelName: 'AdminUser',
            tableName: 'admin_users',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      AdminUser.hasMany(db.Qna, {
         foreignKey: 'admin_id',
         sourceKey: 'admin_id',
      })
      AdminUser.hasMany(db.Faq, {
         foreignKey: 'admin_id',
         sourceKey: 'admin_id',
      })
      AdminUser.hasMany(db.Notice, {
         foreignKey: 'admin_id',
         sourceKey: 'admin_id',
      })
      AdminUser.hasMany(db.SystemKeyValue, {
         foreignKey: 'admin_id',
         as: 'admin',
         sourceKey: 'admin_id',
      })
      AdminUser.hasMany(db.SystemKeyValue, {
         foreignKey: 'prev_admin_id',
         as: 'prev_admin',
         sourceKey: 'admin_id',
      })
      AdminUser.hasMany(db.UserSanction, {
         foreignKey: 'admin_id',
         targetKey: 'admin_id',
      })
   }
}
