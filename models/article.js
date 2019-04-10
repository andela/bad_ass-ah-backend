const articleModel = (Sequelize, DataTypes) => {
  const Article = Sequelize.define('article', {
    article_id: {
      type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true
    },
    title: { type: DataTypes.STRING },
    body: { type: DataTypes.TEXT },
    taglist: { type: DataTypes.ARRAY(DataTypes.STRING) },
    author: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    image: { type: DataTypes.STRING, allowNull: true }
  }, {});
  Article.associate = (models) => {
    Article.hasMany(models.comments, {
      foreignKey: 'articleId',
      allowNull: false
    });
    Article.belongsTo(models.user, { as: 'authorfkey', foreignKey: 'author' });
  };
  return Article;
};

export default articleModel;
