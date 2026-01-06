// moovy-api/src/models/password_reset_token.js
import { Model, DataTypes } from 'sequelize'

export default class PasswordResetToken extends Model {
   static init(sequelize) {
      return super.init(
         {
            id: {
               type: DataTypes.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            token_hash: {
               type: DataTypes.STRING(255),
               allowNull: false,
            },
            expires_at: {
               type: DataTypes.DATE,
               allowNull: false,
            },
            used_at: {
               type: DataTypes.DATE,
               allowNull: true,
            },
         },
         {
            sequelize,
            modelName: 'PasswordResetToken',
            tableName: 'password_reset_tokens',
            timestamps: true,
            updatedAt: false,
            underscored: true,
         }
      )
   }

   static associate(db) {
      PasswordResetToken.belongsTo(db.User, {
         foreignKey: 'user_id',
         targetKey: 'user_id',
      })
   }
}
