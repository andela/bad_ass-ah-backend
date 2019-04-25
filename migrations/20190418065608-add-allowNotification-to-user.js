const addAllowNotification = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'allowNotifications', {
    type: Sequelize.BOOLEAN,
    after: 'isActivated',
    onDelete: 'CASCADE',
    defaultValue: 'true'
  }),

  down: queryInterface => queryInterface.removeColumn('users', 'allowNotifications')
};

export default addAllowNotification;
