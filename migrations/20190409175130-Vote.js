

const voteMigration = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('votes',
    {
      vote_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      user: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }

      },
      article: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'articles',
          key: 'article_id'
        }
      },
      like: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      dislike: {
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
  down: queryInterface => queryInterface.dropTable('votes')
};

export default voteMigration;
