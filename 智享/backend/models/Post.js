const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Post = sequelize.define('Post', {
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT },
  location: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'open' }, // open, accepted, completed
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
});

Post.belongsTo(User, { foreignKey: 'userId' });
module.exports = Post;