const commentHistoryMigration = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('editedcommentshistories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    commentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'comments', key: 'id'
      }
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'users', key: 'id'
      }
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('editedcommentshistories')
};

export default commentHistoryMigration;
