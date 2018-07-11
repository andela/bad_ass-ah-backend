import dotenv from 'dotenv';

dotenv.config();

const fs = require('fs');

module.exports = {
  development: {
    username: process.env.USERNAME_DEV,
    password: process.env.PASSWORD_DEV,
    database: process.env.DB_DEV,
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: process.env.USERNAME_TEST,
    password: process.env.PASSWORD_TEST,
    database: process.env.DB_TEST,
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    username: process.env.USERNAME_PRODUCTION,
    password: process.env.PASSWORD_PRODUCTION,
    database: process.env.DB_PRODUCTION,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres'
  }
};
