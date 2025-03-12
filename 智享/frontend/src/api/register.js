const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    // ...existing code...
    // 处理注册逻辑
    // ...existing code...
    res.status(200).send({ message: '注册成功' });
});

module.exports = router;
