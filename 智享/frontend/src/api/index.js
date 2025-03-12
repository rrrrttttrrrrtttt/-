import axios from 'axios';

// ...existing code...

export const sendVerificationCode = (phoneNumber) => {
  return axios.post('/api/send-verification-code', { phoneNumber });
};

export const registerUser = (email, password, name) => {
  return axios.post('/api/auth/register', { email, password, name });
};

// ...existing code...
