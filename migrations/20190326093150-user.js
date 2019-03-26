'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', { 
      id: {
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement: true
      },
      username:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:true
      },
      email:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:true
      },
      password:{
        allowNull:false,
        type:Sequelize.STRING
      },
      bio:{
        allowNull:true,
        type:Sequelize.STRING
      },
      image:{
        allowNull:true,
        type:Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        default:true
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }   
    });
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('users');
  }
};
