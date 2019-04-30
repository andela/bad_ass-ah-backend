const articleHighlightsModel = (sequelize, DataTypes) => {
  const ArticleHighlights = sequelize.define('articleHighlights', {
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'article', key: 'article_id' }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'user', key: 'id' }
    },
    indexStart: { type: DataTypes.INTEGER, allowNull: false },
    indexEnd: { type: DataTypes.INTEGER, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false }
  }, {});
  ArticleHighlights.associate = (models) => {
    ArticleHighlights.belongsTo(models.article, { foreignKey: 'articleId', onDelete: 'CASCADE' });
    ArticleHighlights.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };
  return ArticleHighlights;
};

export default articleHighlightsModel;
