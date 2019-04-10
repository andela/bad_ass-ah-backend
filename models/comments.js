const commentModel = (sequelize, DataTypes) => {
  const Comments = sequelize.define('comments', {
    body: { type: DataTypes.TEXT },
    articleId: {
      type: DataTypes.INTEGER, references: { model: 'article', key: 'article_id' }
    },
    author: {
      type: DataTypes.INTEGER, references: { model: 'user', key: 'id' }
    }
  }, {});
  Comments.associate = (models) => {
    Comments.belongsTo(models.article, {
      as: 'articlefkey', foreignKey: 'articleId', onDelete: 'CASCADE'
    });
    Comments.belongsTo(models.user, {
      as: 'userfkey', foreignKey: 'author', onDelete: 'CASCADE'
    });
  };
  return Comments;
};

export default commentModel;
