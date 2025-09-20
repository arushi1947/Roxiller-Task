// src/components/RatingStars.jsx
import React from 'react';
import { FaStar } from 'react-icons/fa';

export default function RatingStars({ value = 0 }) {
  const v = Math.round(Number(value) || 0);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <FaStar key={i} className={`text-sm ${i <= v ? 'text-yellow-400' : 'text-gray-300'}`} />
      ))}
      <span className="text-xs text-gray-500 ml-2">({value})</span>
    </div>
  );
}
