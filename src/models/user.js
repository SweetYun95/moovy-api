// moovy-api/src/models/user.js
import { Model, DataTypes } from 'sequelize'

export default class User extends Model {
   static init(sequelize) {
      return super.init(
         {
            // 최소 필드만 (필요 시 확장)
            email: { type: DataTypes.STRING(100), allowNull: false, unique: true, validate: { isEmail: true } },
            password: { type: DataTypes.STRING(255), allowNull: true },
            name: { type: DataTypes.STRING(50), allowNull: false },
            role: { type: DataTypes.ENUM('ADMIN', 'USER'), allowNull: false, defaultValue: 'USER' },
         },
         {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
            underscored: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            indexes: [{ unique: true, fields: ['email'] }],
         }
      )
   }

   //    static associate(db) {
   //     //   관계는 나중에 여기서 연결
   //    }
}
