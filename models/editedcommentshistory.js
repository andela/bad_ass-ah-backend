const editedCommentHistoryModel = (sequelize, DataTypes) => {
  const EditedCommentsHistory = sequelize.define('editedcommentshistory', {
    commentId: { type: DataTypes.INTEGER },
    userId: { type: DataTypes.INTEGER },
    body: { type: DataTypes.TEXT }
  }, {});
  EditedCommentsHistory.associate = (models) => {
    EditedCommentsHistory.belongsTo(models.comments, {
      as: 'commentforeignkey', foreignKey: 'commentId', onDelete: 'CASCADE'
    });

    EditedCommentsHistory.belongsTo(models.user, {
      as: 'userforeignkey', foreignKey: 'userId', onDelete: 'CASCADE'
    });
  };
  return EditedCommentsHistory;
};

export default editedCommentHistoryModel;
