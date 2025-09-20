// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: handle 401 globally (redirect to login)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // clear local auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If you are on client-side routing, use window.location to force navigation
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
