const notificationModel = (sequelize, DataTypes) => {
  const Notification = sequelize.define('notification', {
    userId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  Notification.associate = (models) => {
    Notification.belongsTo(models.user, {
      as: 'userfkey',
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Notification;
};

export default notificationModel;
