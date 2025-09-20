// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../../api';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import { FiUsers, FiShoppingBag, FiStar } from 'react-icons/fi';

export default function AdminDashboard(){
  const [stats, setStats] = useState(null);
  useEffect(()=>{ API.get('/admin/dashboard').then(r=>setStats(r.data)).catch(()=>{}); }, []);
  const sidebar = [
    { to: '/admin', label: 'Dashboard', icon: '🏠' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
  ];
  if (!stats) return <div className="p-6">Loading...</div>;

  return (
    <Layout sidebarItems={sidebar}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total users" value={stats.total_users} icon={<FiUsers />} />
        <Card title="Total stores" value={stats.total_stores} icon={<FiShoppingBag />} />
        <Card title="Total ratings" value={stats.total_ratings} icon={<FiStar />} />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Quick actions</h3>
        <div className="flex gap-3">
          <a href="/admin/users" className="px-4 py-2 bg-indigo-600 text-white rounded">Manage users</a>
          <a href="/admin/stores" className="px-4 py-2 border rounded">Manage stores</a>
        </div>
      </div>
    </Layout>
  );
}
