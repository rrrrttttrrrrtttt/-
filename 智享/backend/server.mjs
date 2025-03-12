import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const SENDCLOUD_API_USER = process.env.SENDCLOUD_API_USER;
const SENDCLOUD_API_KEY = process.env.SENDCLOUD_API_KEY;
const SENDCLOUD_FROM = process.env.SENDCLOUD_FROM;

// 处理根路径的路由
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// 发送验证码邮件
app.post("/send-verification", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "缺少 email 参数" });

    const code = Math.floor(100000 + Math.random() * 900000); // 生成 6 位验证码
    const content = `<p>您的验证码是 <b>${code}</b>，有效期5分钟。</p>`;

    try {
        const response = await axios.post("https://api.sendcloud.net/apiv2/mail/send", null, {
            params: {
                apiUser: SENDCLOUD_API_USER,
                apiKey: SENDCLOUD_API_KEY,
                from: SENDCLOUD_FROM,
                fromName: "你的 App 名称",
                to: email,
                subject: "您的验证码",
                html: content,
            },
        });

        if (response.data.statusCode === "200") {
            res.json({ message: "验证码已发送", code }); // ⚠️ 生产环境不要返回验证码
        } else {
            res.status(500).json({ error: "邮件发送失败", detail: response.data });
        }
    } catch (error) {
        res.status(500).json({ error: "请求失败", detail: error.message });
    }
});

// 运行服务器
const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
