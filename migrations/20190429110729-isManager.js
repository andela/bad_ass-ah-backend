

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'isManager', {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }),
  down: queryInterface => queryInterface.removeColumn('users', 'isManager')
};
