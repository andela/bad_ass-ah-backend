const commentVotes = (Sequelize, DataTypes) => {
  const VotesForComments = Sequelize.define('votecomment', {
    id: {
      type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true
    },
    userId: { type: DataTypes.INTEGER, references: { model: 'user', key: 'id' } },
    commentId: { type: DataTypes.INTEGER, references: { model: 'comments', key: 'id' } },
    like: { type: DataTypes.BOOLEAN },
    dislike: { type: DataTypes.BOOLEAN },
  }, {});
  VotesForComments.associate = (models) => {
    VotesForComments.belongsTo(models.comments, { as: 'commentfkey', foreignKey: 'commentId' });
    VotesForComments.belongsTo(models.user, { as: 'userfkey', foreignKey: 'userId' });
  };
  return VotesForComments;
};

export default commentVotes;
