import React, { useEffect, useState } from 'react';
import API from '../../api';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const userSchema = Yup.object({
  name: Yup.string().required('Name required'),
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().min(6, 'Min 6 chars').required('Password required'),
  address: Yup.string().required('Address required'),
  role: Yup.string().oneOf(['admin','user','owner']).required('Role required'),
});

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetch = async (filters = {}) => {
    const res = await API.get('/admin/users', { params: filters });
    setUsers(res.data);
  };
  useEffect(() => { fetch(); }, []);

  // 👇 Removed "Avg Rating" column
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Address', accessor: 'address' }
  ];

  return (
    <Layout sidebarItems={[
      { to: '/admin', label: 'Dashboard', icon: '🏠' },
      { to: '/admin/users', label: 'Users', icon: '👥' },
      { to: '/admin/stores', label: 'Stores', icon: '🏬' }
    ]}>
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

      {/* Create User Form */}
      <Formik
        initialValues={{ name:'', email:'', password:'', address:'', role:'user' }}
        validationSchema={userSchema}
        onSubmit={async (values,{resetForm,setSubmitting})=>{
          try {
            await API.post('/admin/add-user', values);
            resetForm();
            fetch();
          } catch(err) {
            console.error(err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({isSubmitting})=>(
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white p-4 rounded shadow mb-6">
            <Field name="name" placeholder="Name" className="border p-2 rounded"/>
            <ErrorMessage name="name" component="div" className="text-red-500 text-xs"/>
            
            <Field name="email" placeholder="Email" className="border p-2 rounded"/>
            <ErrorMessage name="email" component="div" className="text-red-500 text-xs"/>
            
            <Field name="password" type="password" placeholder="Password" className="border p-2 rounded"/>
            <ErrorMessage name="password" component="div" className="text-red-500 text-xs"/>
            
            <Field name="address" placeholder="Address" className="border p-2 rounded"/>
            <ErrorMessage name="address" component="div" className="text-red-500 text-xs"/>
            
            <Field as="select" name="role" className="border p-2 rounded">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </Field>
            <ErrorMessage name="role" component="div" className="text-red-500 text-xs"/>

            <div className="md:col-span-5 flex justify-end">
              <button type="submit" disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded">
                {isSubmitting?'Adding...':'Add User'}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* User Table */}
      <Table columns={columns} data={users}/>
    </Layout>
  );
}
