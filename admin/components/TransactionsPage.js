'use client';

import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';

export default function TransactionsPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, pageSize: 20, search });
      if (type) params.set('type', type);
      const res = await fetch(`/api/transactions?${params}`);
      const json = await res.json();
      setData(json.data || []);
      setTotal(json.total || 0);
    } catch {} finally { setLoading(false); }
  }, [page, search, type]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fmt = (v) => Number(v || 0).toLocaleString('en-IN');

  const columns = [
    { key: 'txn_id', label: 'Transaction ID', render: (val) => <span className="text-xs font-mono text-slate-600">{val}</span> },
    { key: 'from_username', label: 'From', render: (val, row) => (
      <div><p className="text-sm font-medium text-slate-700">{val || 'System'}</p><p className="text-xs text-slate-400">{row.from_role}</p></div>
    )},
    { key: 'to_username', label: 'To', render: (val, row) => (
      <div><p className="text-sm font-medium text-slate-700">{val || '-'}</p><p className="text-xs text-slate-400">{row.to_role}</p></div>
    )},
    { key: 'amount', label: 'Amount', render: (val) => <span className="font-semibold">{fmt(val)}</span> },
    { key: 'type', label: 'Type', render: (val) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
        ${val === 'CREDIT' ? 'bg-green-50 text-green-700' : val === 'DEBIT' ? 'bg-red-50 text-red-700' : 
        val === 'WIN' ? 'bg-blue-50 text-blue-700' : val === 'BET' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-700'}`}>
        {val}
      </span>
    )},
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'created_at', label: 'Date', render: (val) => (
      <div><p className="text-sm">{new Date(val).toLocaleDateString()}</p><p className="text-xs text-slate-400">{new Date(val).toLocaleTimeString()}</p></div>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-slate-800">Transactions</h2>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500">Filter Type:</label>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="CREDIT">CREDIT</option>
            <option value="DEBIT">DEBIT</option>
            <option value="BET">BET</option>
            <option value="WIN">WIN</option>
            <option value="LOSS">LOSS</option>
            <option value="REFUND">REFUND</option>
          </select>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        totalCount={total}
        page={page}
        pageSize={20}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by transaction ID, username..."
        loading={loading}
        emptyMessage="No transactions found"
      />
    </div>
  );
}
