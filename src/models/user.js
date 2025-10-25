// moovy-api/src/models/user.js
import { Model, DataTypes } from 'sequelize'

export default class User extends Model {
   static init(sequelize) {
      return super.init(
         {
            user_id: {
               type: DataTypes.INTEGER,
               primaryKey: true,
               autoIncrement: true,
               allowNull: false,
            },
            google: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: false,
            },
            kakao: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: false,
            },
            google_id: {
               type: DataTypes.STRING(100),
               allowNull: true,
            },
            kakao_id: {
               type: DataTypes.STRING(100),
               allowNull: true,
            },
            email: {
               type: DataTypes.STRING(100),
               allowNull: false,
               unique: true,
               validate: {
                  isEmail: true,
               },
            },
            password: {
               type: DataTypes.STRING(255),
               allowNull: true,
            },
            name: {
               type: DataTypes.STRING(40),
               allowNull: false,
            },
            state: {
               type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'DELETED'),
               allowNull: false,
               defaultValue: 'ACTIVE',
            },
         },
         {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      User.hasMany(db.Qna, {
         foreignKey: 'user_id',
         sourceKey: 'user_id',
      })
      User.hasMany(db.UserSanction, {
         foreignKey: 'user_id',
         sourceKey: 'user_id',
      })
      User.hasOne(db.UserDetail, {
         foreignKey: 'user_id',
         sourceKey: 'user_id',
         as: 'detail',
      })
      User.hasMany(db.Favorite, {
         foreignKey: 'user_id',
         sourceKey: 'user_id',
      })
      User.belongsToMany(db.VideoContent, {
         foreignKey: 'user_id',
         otherKey: 'content_id',
         through: db.Favorite,
         as: 'favoriteContents',
      })

      User.hasMany(db.Rating, {
         foreignKey: 'user_id',
         sourceKey: 'user_id',
      })
      User.belongsToMany(db.VideoContent, {
         foreignKey: 'user_id',
         otherKey: 'content_id',
         through: db.Rating,
         as: 'ratingContents',
      })
      User.hasMany(db.CommentTbl, {
         foreignKey: 'user_id',
         sourceKey: 'user_id',
      })
      User.hasMany(db.CommentReply, {
         foreignKey: 'user_id',
         sourceKey: 'user_id',
      })

      User.hasMany(db.CommentReport, {
         foreignKey: 'reporter_id',
         sourceKey: 'user_id',
         as: 'commentReporter',
      })
      User.hasMany(db.CommentReport, {
         foreignKey: 'reported_id',
         sourceKey: 'user_id',
         as: 'commentReported',
      })

      User.hasMany(db.CommentReplyReport, {
         foreignKey: 'reporter_id',
         sourceKey: 'user_id',
         as: 'reporter',
      })
      User.hasMany(db.CommentReplyReport, {
         foreignKey: 'reported_id',
         sourceKey: 'user_id',
         as: 'reported',
      })
   }
}
