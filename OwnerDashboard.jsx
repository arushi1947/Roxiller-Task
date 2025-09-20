// src/pages/owner/OwnerDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../../api';
import Layout from '../../components/Layout';
import { motion } from 'framer-motion';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);

  const fetch = async () => {
    try {
      const res = await API.get('/owner/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching owner dashboard', err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Layout
      sidebarItems={[
        { to: '/owner/dashboard', label: 'Dashboard', icon: '📊' },
      ]}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-6">Owner Dashboard</h2>

        {!data ? (
          <p className="text-gray-600">Loading...</p>
        ) : data.stores.length === 0 ? (
          <p className="text-gray-600">No stores registered under your account.</p>
        ) : (
          <div className="grid gap-6">
            {data.stores.map((store) => (
              <div
                key={store.store_id}
                className="bg-white border border-gray-200 shadow-sm rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {store.store_name}
                </h3>
                <p className="text-gray-600 text-sm">{store.address}</p>
                <p className="text-gray-700 font-medium mt-2">
                  ⭐ Average Rating: {store.avg_rating || 'N/A'}
                </p>

                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full border border-gray-200 text-sm text-left">
                    <thead>
                      <tr className="bg-gray-100 text-gray-800">
                        <th className="px-3 py-2 border border-gray-200">User</th>
                        <th className="px-3 py-2 border border-gray-200">Email</th>
                        <th className="px-3 py-2 border border-gray-200">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.users_who_rated.length > 0 ? (
                        store.users_who_rated.map((u) => (
                          <tr
                            key={u.user_id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-3 py-2 border border-gray-200 text-gray-800">
                              {u.name}
                            </td>
                            <td className="px-3 py-2 border border-gray-200 text-gray-600">
                              {u.email}
                            </td>
                            <td className="px-3 py-2 border border-gray-200 text-indigo-600 font-semibold">
                              {u.rating}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-3 py-2 text-gray-500 text-center"
                          >
                            No ratings yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </Layout>
  );
}
