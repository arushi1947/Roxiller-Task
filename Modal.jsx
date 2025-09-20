// src/components/Modal.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded shadow-lg z-50 w-full max-w-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="px-2 py-1">✕</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
