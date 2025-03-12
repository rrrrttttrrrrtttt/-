require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendCloudTransport = require('nodemailer-sendcloud-transport');
const User = require('./models/User');
const sequelize = require('./config/db');

const app = express();
const port = 8000;

app.use(express.json());

// 邮件发送配置
const transporter = nodemailer.createTransport(sendCloudTransport({
  apiUser: process.env.SENDCLOUD_API_USER,
  apiKey: process.env.SENDCLOUD_API_KEY
}));

// 生成验证码
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// 注册路由
app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const verificationCode = generateVerificationCode();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name, verificationCode });

    // 发送验证码邮件
    const mailOptions = {
      from: process.env.SENDCLOUD_FROM,
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email', error: error.message });
      }
      res.json({ message: 'User registered and verification code sent' });
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// 同步数据库并启动服务器
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});