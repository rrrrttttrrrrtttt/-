import React, { useState } from 'react';
import { registerUser } from '../api';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await registerUser(email, password, name);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Registration failed');
      console.error(error);
    }
  };

  interface LoginResponse {
    token: string;
  }
  
  const handleLogin = async () => {
    try {
      const response = await axios.post<LoginResponse>('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      setMessage(`Login successful: ${response.data.token}`);
    } catch (error) {
      setMessage('Login failed');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {!isLogin && (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
      )}
      <button onClick={isLogin ? handleLogin : handleRegister}>
        {isLogin ? 'Login' : 'Register'}
      </button>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;