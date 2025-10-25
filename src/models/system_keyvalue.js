// moovy-api/src/models/system_keyvalue.js
import { Model, DataTypes } from 'sequelize'

export default class SystemKeyValue extends Model {
   static init(sequelize) {
      return super.init(
         {
            key: {
               type: DataTypes.STRING(255),
               allowNull: false,
               primaryKey: true,
            },
            value: {
               type: DataTypes.TEXT,
               allowNull: false,
            },
            prev_value: {
               type: DataTypes.TEXT,
               allowNull: true,
            },
            admin_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            prev_admin_id: {
               type: DataTypes.INTEGER,
               allowNull: true,
            },
         },
         {
            sequelize,
            modelName: 'SystemKeyValue',
            tableName: 'system_keyvalues',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      SystemKeyValue.belongsTo(db.AdminUser, {
         foreignKey: 'admin_id',
         as: 'admin',
         targetKey: 'admin_id',
      })
      SystemKeyValue.belongsTo(db.AdminUser, {
         foreignKey: 'prev_admin_id',
         as: 'prev_admin',
         targetKey: 'admin_id',
      })
   }
}
