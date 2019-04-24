
const followerModel = (Sequelize, DataTypes) => {
  const Follower = Sequelize.define('follower', {
    follower_id: {
      type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    followedBy: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'user', key: 'id' } }
  }, {});
  Follower.associate = (models) => {
    Follower.belongsTo(models.user, { as:"userFkey",foreignKey: 'userId', onDelete: 'CASCADE' });
    Follower.belongsTo(models.user, { as:"followedFkey", foreignKey: 'followedBy', onDelete: 'CASCADE' });
  };
  return Follower;
};

export default followerModel;
