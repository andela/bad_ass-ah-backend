const rateMigration = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('rates', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'id',
        as: 'userId'
      }
    },
    articleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'articles',
        key: 'article_id',
        as: 'articleId'
      }
    },
    rating: {
      type: Sequelize.INTEGER,
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
  down: queryInterface => queryInterface.dropTable('rates')
};

export default rateMigration;
