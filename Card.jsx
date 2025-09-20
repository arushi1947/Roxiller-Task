// src/components/Card.jsx
import React from 'react';

export default function Card({ title, value, icon }) {
  return (
    <div className="p-4 bg-white border rounded shadow-sm flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
      <div className="text-3xl text-indigo-500">{icon}</div>
    </div>
  );
}
