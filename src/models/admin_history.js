// moovy-api/src/models/admin_history.js
import { Model, DataTypes } from 'sequelize'

export default class AdminHistory extends Model {
   static init(sequelize) {
      return super.init(
         {
            history_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },

            // ✅ 누가(관리자) 했는지 (시스템 자동 이벤트면 null 가능)
            admin_id: {
               type: DataTypes.INTEGER,
               allowNull: true,
            },

            // ✅ 누구(유저) 대상으로 한 이벤트인지 (대상이 유저가 아니면 null 가능)
            user_id: {
               type: DataTypes.INTEGER,
               allowNull: true,
            },

            // ✅ 행동 타입
            // 예: USER_CREATED, USER_SANCTIONED, USER_DELETED, QNA_ANSWERED ...
            action: {
               type: DataTypes.STRING(50),
               allowNull: false,
            },

            // ✅ 화면에 바로 뿌릴 메시지
            message: {
               type: DataTypes.STRING(255),
               allowNull: false,
            },

            // ✅ 여분 정보(TEXT)
            // - JSON.stringify(...) 해서 넣고
            // - 필요하면 JSON.parse(...) 해서 쓰는 방식
            meta: {
               type: DataTypes.TEXT,
               allowNull: true,
            },
         },
         {
            sequelize,
            modelName: 'AdminHistory',
            tableName: 'admin_histories',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            indexes: [
               { fields: ['created_at'], name: 'idx_admin_histories_created_at' },
               { fields: ['action'], name: 'idx_admin_histories_action' },
               { fields: ['admin_id'], name: 'idx_admin_histories_admin_id' },
               { fields: ['user_id'], name: 'idx_admin_histories_user_id' },
            ],
         }
      )
   }

   static associate(db) {
      // ✅ AdminUser 관계 (actor)
      AdminHistory.belongsTo(db.AdminUser, {
         foreignKey: 'admin_id',
         targetKey: 'admin_id',
         as: 'admin',
         onDelete: 'SET NULL',
         onUpdate: 'CASCADE',
      })

      // ✅ User 관계 (target)
      AdminHistory.belongsTo(db.User, {
         foreignKey: 'user_id',
         targetKey: 'user_id',
         as: 'user',
         onDelete: 'SET NULL',
         onUpdate: 'CASCADE',
      })
   }
}
