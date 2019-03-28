const UserModel = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    bio: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    isAdmin: { type: DataTypes.BOOLEAN },
    isActivated: { type: DataTypes.BOOLEAN }
  }, {});
  return User;
};

export default UserModel;
