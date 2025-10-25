// moovy-api/src/models/comment_report.js
import { Model, DataTypes } from 'sequelize'

export default class CommentReport extends Model {
   static init(sequelize) {
      return super.init(
         {
            report_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            reporter_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            reported_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            comment_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            report_type: {
               type: DataTypes.ENUM('OTHER', 'SPAM', 'SPOILER', 'ABUSE', 'HARASSMENT'),
               defaultValue: 'OTHER',
            },
         },
         {
            sequelize,
            modelName: 'CommentReport',
            tableName: 'comment_reports',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      CommentReport.belongsTo(db.User, {
         foreignKey: 'reporter_id',
         targetKey: 'user_id',
         as: 'commentReporter',
         onDelete: 'CASCADE',
      })
      CommentReport.belongsTo(db.User, {
         foreignKey: 'reported_id',
         targetKey: 'user_id',
         as: 'commentReported',
         onDelete: 'CASCADE',
      })
      CommentReport.belongsTo(db.CommentTbl, {
         foreignKey: 'comment_id',
         targetKey: 'comment_id',
         onDelete: 'CASCADE',
      })
   }
}
