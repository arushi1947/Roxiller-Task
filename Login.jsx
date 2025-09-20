// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const auth = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const u = await auth.login(email, password);
      if (u.role === 'admin') nav('/admin');
      else if (u.role === 'user') nav('/stores');
      else if (u.role === 'owner') nav('/owner/dashboard');
      else nav('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/home.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md p-8 rounded-xl shadow-lg bg-white/10 backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        {err && <div className="text-red-400 text-sm mb-3">{err}</div>}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium shadow-md"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}
