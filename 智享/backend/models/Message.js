const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Message = sequelize.define('Message', {
  content: { type: DataTypes.TEXT },
  senderId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  receiverId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
});

Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });
module.exports = Message;