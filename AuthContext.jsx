// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (token && userJson) {
      try { setUser(JSON.parse(userJson)); }
      catch (e) { localStorage.removeItem('user'); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const signup = async (name, email, password, address) => {
    const res = await API.post('/auth/signup', { name, email, password, address });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const changePassword = async (newPassword) => {
    return API.post('/auth/change-password', { newPassword });
  };

  const value = { user, login, signup, logout, changePassword, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
