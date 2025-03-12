const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    // 处理注册逻辑
    // 例如，保存用户到数据库
    // 这里可以添加更多的逻辑
    res.status(200).send({ message: '注册成功' });
});

module.exports = router;