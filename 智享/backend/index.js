require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const messageRoutes = require('./routes/messages');
const transactionRoutes = require('./routes/transactions');
const nodemailer = require('nodemailer');
const sendCloudTransport = require('nodemailer-sendcloud-transport');
import axios from 'axios';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const port = 8000;

app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

// 邮件发送配置
const transporter = nodemailer.createTransport(sendCloudTransport({
  apiUser: process.env.SENDCLOUD_API_USER,
  apiKey: process.env.SENDCLOUD_API_KEY
}));

// 发送验证码的路由
app.post('/send-code', (req, res) => {
  const email = req.body.email;
  const code = Math.floor(100000 + Math.random() * 900000);

  const mailOptions = {
    from: process.env.SENDCLOUD_FROM,
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code is ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.status(200).send('Verification code sent');
  });
});

// 根路径路由
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/transactions', transactionRoutes);

// WebSocket 实时功能
io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('message', async (msg) => {
    const { content, senderId, receiverId } = msg;
    const message = await require('./models/Message').create({ content, senderId, receiverId });
    const fullMessage = await require('./models/Message').findByPk(message.id, {
      include: [
        { model: require('./models/User'), as: 'sender', attributes: ['id', 'name', 'email'] },
        { model: require('./models/User'), as: 'receiver', attributes: ['id', 'name', 'email'] },
      ],
    });
    io.to(receiverId).emit('message', fullMessage);
  });
  socket.on('join', (userId) => socket.join(userId));
});

// 同步数据库
sequelize.sync().then(() => {
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});

export const sendVerificationCode = (email) => {
  return axios.post('/send-verification', { email });
};

export const registerUser = (email, password, name) => {
  return axios.post('/api/auth/register', { email, password, name });
};