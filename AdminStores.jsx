// src/pages/admin/AdminStores.jsx
import React, { useEffect, useState } from 'react';
import API from '../../api';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Yup validation schema
const storeSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Store name must be at least 3 characters')
    .required('Store name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  address: Yup.string()
    .required('Address is required'),
  owner_id: Yup.number()
    .typeError('Owner ID must be a number')
    .nullable(),
});

export default function AdminStores(){
  const [stores, setStores] = useState([]);

  const fetch = async () => {
    try {
      const res = await API.get('/admin/stores');
      setStores(res.data);
    } catch (err) {
      console.error('Error fetching stores', err);
    }
  };
  useEffect(()=>{ fetch(); }, []);

  // Table columns
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Addess', accessor: 'address' },
    { header: 'Avg Rating', accessor: 'avg_rating' },
  ];

  return (
    <Layout sidebarItems={[
      { to: '/admin', label: 'Dashboard', icon: '🏠' },
      { to: '/admin/users', label: 'Users', icon: '👥' },
      { to: '/admin/stores', label: 'Stores', icon: '🏬' }
    ]}>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Add New Store</h3>

        {/* Formik form */}
        <Formik
          initialValues={{ name: '', email: '', address: '', owner_id: '' }}
          validationSchema={storeSchema}
          onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
            try {
              await API.post('/admin/add-store', {
                ...values,
                owner_id: values.owner_id || null,
              });
              resetForm();
              fetch();
            } catch (err) {
              const msg = err.response?.data?.message || 'Error creating store';
              setErrors({ email: msg }); // Example: show error under email
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded shadow">
              {/* Store name */}
              <div>
                <Field
                  name="name"
                  placeholder="Store name"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Email */}
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Store email"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Address */}
              <div>
                <Field
                  name="address"
                  placeholder="Address"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Owner ID */}
              <div>
                <Field
                  name="owner_id"
                  placeholder="Owner ID (optional)"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage name="owner_id" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Submit button */}
              <div className="md:col-span-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Store'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Stores table */}
      <div>
        <h3 className="text-xl font-bold mb-4">All Stores</h3>
        <Table columns={columns} data={stores} />
      </div>
    </Layout>
  );
}
