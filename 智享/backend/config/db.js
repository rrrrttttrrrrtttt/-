const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:pgop1008@localhost:5432/postgres', {
  dialect: 'postgres',
});

module.exports = sequelize;