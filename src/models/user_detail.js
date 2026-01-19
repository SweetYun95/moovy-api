// moovy-api/src/models/user_detail.js
import { Model, DataTypes } from 'sequelize'

export default class UserDetail extends Model {
   static init(sequelize) {
      return super.init(
         {
            user_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               unique: true,
            },
            agree_email: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: false,
            },
            agree_kakao: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: false,
            },
            agree_app: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: false,
            },
            language: {
               type: DataTypes.ENUM('KR', 'EN', 'CN', 'JP'),
               allowNull: false,
               defaultValue: 'KR',
            },
         },
         {
            sequelize,
            modelName: 'UserDetail',
            tableName: 'user_details',
            timestamps: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      UserDetail.belongsTo(db.User, {
         foreignKey: 'user_id',
         targetKey: 'user_id',
         as: 'detail',
         onDelete: 'CASCADE',
         onUpdate: 'CASCADE',
      })
   }
}
