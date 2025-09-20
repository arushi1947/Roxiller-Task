// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/home.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center text-white max-w-2xl px-4"
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight">
          Discover & Rate Local Stores
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 mb-8">
          Roxiller helps you explore shops around you, share experiences,
          and build trust in your community.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium shadow-md"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 bg-white/90 hover:bg-white text-indigo-700 rounded font-medium shadow-md"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
