const articleStatsModel = (sequelize, DataTypes) => {
  const ArticleStats = sequelize.define('articleStats', {
    articleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'article',
        key: 'article_id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    numberOfReading: { type: DataTypes.INTEGER }
  }, {});
  ArticleStats.associate = (models) => {
    ArticleStats.belongsTo(models.article, { foreignKey: 'articleId', onDelete: 'CASCADE' });
    ArticleStats.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };
  return ArticleStats;
};

export default articleStatsModel;
