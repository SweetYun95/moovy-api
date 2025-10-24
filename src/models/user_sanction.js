// moovy-api/src/models/user_sanction.js
import { Model, DataTypes } from 'sequelize'

export default class UserSanction extends Model {
   static init(sequelize) {
      return super.init(
         {
            user_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            admin_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            start_at: {
               type: DataTypes.DATE,
               allowNull: false,
            },
            end_at: {
               type: DataTypes.DATE,
               allowNull: false,
            },
            reason: {
               type: DataTypes.TEXT,
               allowNull: false,
            },
         },
         {
            sequelize,
            modelName: 'UserSanction',
            tableName: 'user_sanctions',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      UserSanction.belongsTo(db.User, {
         foreignKey: 'user_id',
         targetKey: 'user_id',
         onDelete: 'CASCADE',
      })
      UserSanction.belongsTo(db.AdminUser, {
         foreignKey: 'admin_id',
         targetKey: 'admin_id',
      })
   }
}
