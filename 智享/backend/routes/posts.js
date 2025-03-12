const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const router = express.Router();

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });
  const decoded = jwt.verify(token, 'your-secret-key');
  req.user = decoded;
  next();
};

router.post('/', auth, async (req, res) => {
  const post = await Post.create({ ...req.body, userId: req.user.id });
  res.json(post);
});

router.get('/', async (req, res) => {
  const { search } = req.query;
  const where = search ? { title: { [require('sequelize').Op.like]: `%${search}%` } } : {};
  const posts = await Post.findAll({ where, include: ['User'] });
  res.json(posts);
});

router.put('/:id/accept', auth, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  post.status = 'accepted';
  await post.save();
  io.to(post.userId).emit('notification', { message: `Your post ${post.title} was accepted` });
  res.json(post);
});

router.put('/:id/complete', auth, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  post.status = 'completed';
  await post.save();
  io.to(post.userId).emit('notification', { message: `Your post ${post.title} is completed` });
  res.json(post);
});

module.exports = router;