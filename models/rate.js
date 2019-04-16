const rateModel = (sequelize, DataTypes) => {
  const Rate = sequelize.define('rate', {
    userId: { type: DataTypes.INTEGER, references: { model: 'user', key: 'id' } },
    articleId: { type: DataTypes.INTEGER, references: { model: 'article', key: 'id' } },
    rating: { type: DataTypes.INTEGER, allowNull: false }
  }, {});
  Rate.associate = (models) => {
    Rate.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Rate.belongsTo(models.article, { foreignKey: 'articleId', onDelete: 'CASCADE' });
  };
  return Rate;
};

export default rateModel;
