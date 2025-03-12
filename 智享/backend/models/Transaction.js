const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Post = require('./Post');

const Transaction = sequelize.define('Transaction', {
  amount: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  paymentMethod: { type: DataTypes.STRING }, // wechat, alipay
  postId: { type: DataTypes.INTEGER, references: { model: Post, key: 'id' } },
  payerId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  payeeId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
});

Transaction.belongsTo(Post, { foreignKey: 'postId' });
Transaction.belongsTo(User, { as: 'payer', foreignKey: 'payerId' });
Transaction.belongsTo(User, { as: 'payee', foreignKey: 'payeeId' });
module.exports = Transaction;