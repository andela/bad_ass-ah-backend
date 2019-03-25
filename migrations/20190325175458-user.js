'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users",{
      id:{
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        type:Sequelize.INTEGER
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        default:true
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }   
    })
  },
  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('users');
  }
};
