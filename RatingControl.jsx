// src/components/RatingControl.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';

export default function RatingControl({ storeId, current, onUpdated }) {
  const [value, setValue] = useState(current ?? 0);

  useEffect(() => setValue(current ?? 0), [current]);

  const submit = async (v) => {
    try {
      if (!current) {
        await API.post(`/stores/${storeId}/rating`, { rating: v });
      } else {
        await API.put(`/stores/${storeId}/rating`, { rating: v });
      }
      onUpdated?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Rating error');
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(n => (
          <button
            key={n}
            onClick={() => submit(n)}
            className={`px-2 py-1 rounded ${n <= (value||0) ? 'bg-yellow-400' : 'bg-gray-200'}`}
            title={`Rate ${n}`}
          >
            {n}
          </button>
        ))}
      </div>
      <small className="text-xs">Click to submit/update</small>
    </div>
  );
}
