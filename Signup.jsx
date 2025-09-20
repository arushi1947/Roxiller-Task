// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

export default function Signup() {
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const auth = useAuth();
  const nav = useNavigate();

  // Validation schema (Yup)
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(20, 'Name must be at least 20 characters')
      .max(60, 'Name must be 60 characters or less')
      .required('Full name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    address: Yup.string()
      .required('Address is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  // Handle form submit
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setErr(null);
    try {
      await auth.signup(values.name, values.email, values.password, values.address);
      setMsg('Account created — please log in');
      resetForm();
      setTimeout(() => nav('/login'), 1200);
    } catch (error) {
      setErr(error.response?.data?.message || 'Signup failed');
    } finally {
      setSubmitting(false);
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
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign up</h2>
        {msg && <div className="text-green-400 text-sm mb-3">{msg}</div>}
        {err && <div className="text-red-400 text-sm mb-3">{err}</div>}

        <Formik
          initialValues={{ name: '', email: '', address: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <Field
                  type="text"
                  name="name"
                  placeholder="Full name (20-60 chars)"
                  className="w-full border border-white/30 bg-white/20 text-white placeholder-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-400 text-xs mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full border border-white/30 bg-white/20 text-white placeholder-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-400 text-xs mt-1"
                />
              </div>

              {/* Address */}
              <div>
                <Field
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="w-full border border-white/30 bg-white/20 text-white placeholder-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-400 text-xs mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full border border-white/30 bg-white/20 text-white placeholder-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-400 text-xs mt-1"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Sign up'}
              </button>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
}
