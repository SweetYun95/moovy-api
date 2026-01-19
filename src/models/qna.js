// moovy-api/src/models/qna.js
import { Model, DataTypes } from 'sequelize'

export default class Qna extends Model {
   static init(sequelize) {
      return super.init(
         {
            qna_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            user_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            admin_id: {
               type: DataTypes.INTEGER,
               allowNull: true,
            },
            q_title: {
               type: DataTypes.STRING(255),
               allowNull: false,
            },
            q_contnet: {
               type: DataTypes.TEXT,
               allowNull: false,
            },
            a_title: {
               type: DataTypes.STRING(255),
               allowNull: true,
            },
            a_content: {
               type: DataTypes.TEXT,
               allowNull: true,
            },

            state: {
               type: DataTypes.ENUM('PENDING', 'FULFILLED'),
               allowNull: false,
               defaultValue: 'PENDING',
            },

            // ✅ 신규: 답변 완료 시각
            answered_at: {
               type: DataTypes.DATE,
               allowNull: true,
            },
         },
         {
            sequelize,
            modelName: 'Qna',
            tableName: 'qnas',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      Qna.hasMany(db.QnaImage, {
         foreignKey: 'qna_id',
         sourceKey: 'qna_id',
      })

      Qna.belongsTo(db.User, {
         foreignKey: 'user_id',
         targetKey: 'user_id',
         onDelete: 'CASCADE',
      })

      Qna.belongsTo(db.AdminUser, {
         foreignKey: 'admin_id',
         targetKey: 'admin_id',
         onDelete: 'SET NULL',
      })
   }
}
