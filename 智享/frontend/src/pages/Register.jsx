import React, { useState, useEffect } from 'react';
import { sendVerificationCode, registerUser } from '../api/index';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendVerificationCode = async () => {
    try {
      const response = await sendVerificationCode(email);
      if (response.data.message) {
        toast.success('验证码发送成功，有效期5分钟');
        setTimer(60); // 设置计时器为60秒
      } else {
        toast.error('验证码发送失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    }
  };

  const handleRegisterUser = async () => {
    try {
      const response = await registerUser(email, password, name);
      if (response.data.message) {
        toast.success('注册成功');
      } else {
        toast.error('注册失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="请输入手机号"
      />
      <button onClick={handleSendVerificationCode} disabled={timer > 0}>
        {timer > 0 ? `重新发送 (${timer}s)` : '发送验证码'}
      </button>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="请输入邮箱"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="请输入密码"
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="请输入姓名"
      />
      <button onClick={handleRegisterUser}>注册</button>
    </div>
  );
};

export default Register;
