

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'status', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }),

  down: queryInterface => queryInterface.removeColumn('users', 'status')
};
