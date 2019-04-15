module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('comments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    body: {
      type: Sequelize.TEXT
    },
    articleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'articles', key: 'article_id'
      }
    },
    author: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'users', key: 'id'
      }
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
  down: queryInterface => queryInterface.dropTable('comments')
};
