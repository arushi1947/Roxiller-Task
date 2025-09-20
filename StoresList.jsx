// src/pages/user/StoresList.jsx
import React, { useEffect, useState } from 'react';
import API from '../../api';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import RatingStars from '../../components/RatingStars';
import RatingControl from '../../components/RatingControl';

export default function StoresList(){
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState({ name:'', address:'' });
  const [sortBy, setSortBy] = useState({ key: 'name', dir: 'asc' });

  const fetch = async () => {
    const params = { name: q.name || undefined, address: q.address || undefined, sortBy: sortBy.key, sortOrder: sortBy.dir };
    const res = await API.get('/stores', { params });
    setStores(res.data);
  };

  useEffect(()=>{ fetch(); }, [sortBy]);

  const columns = [
    { header: 'Store', accessor: 'name', sortable: true, cell: r => r.name },
    { header: 'Address', accessor: 'address', cell: r => r.address },
    { header: 'Avg Rating', accessor: 'overall_rating', sortable: true, cell: r => <RatingStars value={r.overall_rating} /> },
    { header: 'Your Rating', accessor: 'user_rating', cell: r => r.user_rating ?? '—' },
    { header: 'Action', accessor: 'action', cell: r => <RatingControl storeId={r.id} current={r.user_rating} onUpdated={fetch} /> }
  ];

  const onSort = (col) => {
    setSortBy(s => ({ key: col, dir: s.key === col ? (s.dir === 'asc' ? 'desc' : 'asc') : 'asc' }));
  };

  return (
    <Layout sidebarItems={[]}>
      <div className="mb-4 flex gap-2">
        <input placeholder="Search name" value={q.name} onChange={e=>setQ({...q, name:e.target.value})} className="border p-2 rounded w-60" />
        <input placeholder="Search address" value={q.address} onChange={e=>setQ({...q, address:e.target.value})} className="border p-2 rounded w-60" />
        <button onClick={fetch} className="px-3 py-2 bg-indigo-600 text-white rounded">Search</button>
      </div>

      <Table columns={columns} data={stores} onSort={onSort} sortBy={sortBy} />
    </Layout>
  );
}
