const reportArticleModel = (sequelize, DataTypes) => {
  const ReportArticle = sequelize.define('reportArticle', {
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'article', key: 'article_id' }
    },
    reportTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'reportType', key: 'id' }
    },
    reporter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'user', key: 'id' }
    },
    comment: { type: DataTypes.TEXT }
  }, {});
  ReportArticle.associate = (models) => {
    ReportArticle.belongsTo(models.article, { foreignKey: 'articleId', onDelete: 'CASCADE' });
    ReportArticle.belongsTo(models.reportType, { foreignKey: 'reportTypeId', onDelete: 'CASCADE' });
    ReportArticle.belongsTo(models.user, { foreignKey: 'reporter', onDelete: 'CASCADE' });
  };
  return ReportArticle;
};

export default reportArticleModel;
