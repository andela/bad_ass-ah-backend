module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true
    },
    email: {
      allowNull: true,
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      allowNull: true,
      type: Sequelize.STRING
    },
    bio: {
      allowNull: true,
      type: Sequelize.STRING
    },
    image: {
      allowNull: true,
      type: Sequelize.STRING
    },
    isAdmin: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isActivated: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      default: true
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('users')

};
