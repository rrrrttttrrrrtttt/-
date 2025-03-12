const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.post('/', async (req, res) => {
  const message = await Message.create(req.body);
  res.json(message);
});

router.get('/:userId', async (req, res) => {
  const messages = await Message.findAll({
    where: {
      [require('sequelize').Op.or]: [
        { senderId: req.params.userId },
        { receiverId: req.params.userId },
      ],
    },
    include: ['sender', 'receiver'],
  });
  res.json(messages);
});

module.exports = router;