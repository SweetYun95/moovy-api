// moovy-api/src/models/video_content.js
import { Model, DataTypes } from 'sequelize'

export default class VideoContent extends Model {
   static init(sequelize) {
      return super.init(
         {
            content_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               primaryKey: true,
               autoIncrement: true,
            },
            // ★ 외부(TMDB) 기준 ID
            tmdb_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
               unique: true,
            },
            title: {
               type: DataTypes.STRING(100),
               allowNull: false,
            },
            release_date: {
               type: DataTypes.DATE,
            },
            genre: {
               type: DataTypes.STRING(30),
            },
            time: {
               type: DataTypes.INTEGER,
            },
            age_limit: {
               type: DataTypes.INTEGER,
            },
            plot: {
               type: DataTypes.TEXT,
            },
            // 포스터/백드롭도 미리 넣어두면 프론트가 좋아함
            poster_path: {
               type: DataTypes.STRING(255),
               allowNull: true,
            },
            backdrop_path: {
               type: DataTypes.STRING(255),
               allowNull: true,
            },
         },
         {
            sequelize,
            modelName: 'VideoContent',
            tableName: 'video_contents',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         }
      )
   }

   static associate(db) {
      VideoContent.hasMany(db.VideoContentImage, {
         foreignKey: 'content_id',
         sourceKey: 'content_id',
      })
      VideoContent.hasMany(db.Favorite, {
         foreignKey: 'content_id',
         targetKey: 'content_id',
      })
      VideoContent.belongsToMany(db.User, {
         foreignKey: 'content_id',
         otherKey: 'user_id',
         through: db.Favorite,
      })

      VideoContent.hasMany(db.Rating, {
         foreignKey: 'content_id',
         targetKey: 'content_id',
      })
      VideoContent.belongsToMany(db.User, {
         foreignKey: 'content_id',
         otherKey: 'user_id',
         through: db.Rating,
      })

      // ★ 여기 belongsTo(db.Topic)은 관계상 어색함
      // Topic이 VideoContent에 종속되는 구조라,
      // Topic.belongsTo(VideoContent)가 맞고,
      // VideoContent.hasMany(Topic)이 맞는 방향임.
      VideoContent.hasMany(db.Topic, {
         foreignKey: 'content_id',
         sourceKey: 'content_id',
      })
   }
}
