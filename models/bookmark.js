const bookmarkModel = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('bookmark', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    articleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'article',
        key: 'article_id'
      }
    }
  }, {});
  Bookmark.associate = (models) => {
    Bookmark.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Bookmark.belongsTo(models.article, { foreignKey: 'articleId', onDelete: 'CASCADE' });
  };
  return Bookmark;
};

export default bookmarkModel;
