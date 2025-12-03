// moovy-api/src/models/popular_movie_snapshot.js
import { Model, DataTypes } from 'sequelize'

export default class PopularMovieSnapshot extends Model {
   static init(sequelize) {
      return super.init(
         {
            snapshot_id: {
               type: DataTypes.INTEGER,
               primaryKey: true,
               autoIncrement: true,
            },
            snapshot_date: {
               type: DataTypes.DATEONLY,
               allowNull: false,
            },
            source: {
               type: DataTypes.STRING(30), // 'TMDB_TRENDING' 등
               allowNull: false,
            },
            content_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
            rank: {
               type: DataTypes.INTEGER,
               allowNull: false,
            },
         },
         {
            sequelize,
            modelName: 'PopularMovieSnapshot',
            tableName: 'popular_movie_snapshots',
            timestamps: true,
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            indexes: [
               {
                  name: 'idx_snapshot_date_source_rank',
                  fields: ['snapshot_date', 'source', 'rank'],
               },
               {
                  name: 'uniq_snapshot_date_source_content_id',
                  unique: true,
                  fields: ['snapshot_date', 'source', 'content_id'],
               },
            ],
         }
      )
   }

   static associate(db) {
      PopularMovieSnapshot.belongsTo(db.VideoContent, {
         foreignKey: 'content_id',
         targetKey: 'content_id',
      })
      db.VideoContent.hasMany(db.PopularMovieSnapshot, {
         foreignKey: 'content_id',
         sourceKey: 'content_id',
      })
   }
}
