const voteModels = (Sequelize, DataTypes) => {
  const Votes = Sequelize.define('vote', {
    vote_id: {
      type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true
    },
    user: { type: DataTypes.INTEGER, references: { model: 'user', key: 'id' } },
    article: { type: DataTypes.INTEGER, references: { model: 'article', key: 'article_id' } },
    like: { type: DataTypes.BOOLEAN },
    dislike: { type: DataTypes.BOOLEAN },
  }, {});
  Votes.associate = (models) => {
    Votes.belongsTo(models.article, { as: 'articlefkey', foreignKey: 'article' });
    Votes.belongsTo(models.user, { as: 'userfkey', foreignKey: 'user' });
  };
  return Votes;
};

export default voteModels;
