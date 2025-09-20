// src/components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiLogOut } from 'react-icons/fi';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b">
      <div className="flex items-center gap-4">
        <Link to="/" className="hidden sm:block text-xl font-semibold text-indigo-600">Roxiller</Link>
        <div className="text-sm text-gray-600 hidden md:block">Rate & discover local stores</div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FiUser className="text-lg" />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded">
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-3 py-1 text-sm">Login</Link>
            <Link to="/signup" className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}
