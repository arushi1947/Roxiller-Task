// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

// admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';

// user
import StoresList from './pages/user/StoresList';

// owner
import OwnerDashboard from './pages/owner/OwnerDashboard';

import './index.css'; // simple styles or Tailwind

export default function App(){
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <NavBar />
          <main className="container mx-auto py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Admin */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/stores" element={<ProtectedRoute allowedRoles={['admin']}><AdminStores /></ProtectedRoute>} />

              {/* User */}
              <Route path="/stores" element={<ProtectedRoute allowedRoles={['user']}><StoresList /></ProtectedRoute>} />

              {/* Owner */}
              <Route path="/owner/dashboard" element={<ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>} />

              {/* fallback */}
              <Route path="*" element={<div className="p-6">Page not found</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
