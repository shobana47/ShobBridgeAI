import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user?.token && !user.token.startsWith('demo') && !user.token.startsWith('local')) {
    config.headers.Authorization = `Bearer ${user.token}`;
  } else if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
