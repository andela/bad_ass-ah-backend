const articleHighlightsMigration = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('articleHighlights', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    articleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: { model: 'articles', key: 'article_id', as: 'articleId' }
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: { model: 'users', key: 'id', as: 'userId' }
    },
    indexStart: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    indexEnd: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    comment: {
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
  down: queryInterface => queryInterface.dropTable('articleHighlights')
};

export default articleHighlightsMigration;
