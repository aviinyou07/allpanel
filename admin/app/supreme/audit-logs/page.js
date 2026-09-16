'use client';

import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/DataTable';
import { FileText } from 'lucide-react';

export default function AuditLogsPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/audit-logs?page=${page}&pageSize=20`);
      const json = await res.json();
      setData(json.data || []);
      setTotal(json.total || 0);
    } catch {} finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    { key: 'actor_username', label: 'Actor', render: (val, row) => (
      <div>
        <p className="text-sm font-medium text-slate-700">{val || 'System'}</p>
        <p className="text-xs text-slate-400">{row.actor_role}</p>
      </div>
    )},
    { key: 'action', label: 'Action', render: (val) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">{val}</span>
    )},
    { key: 'target_type', label: 'Target', render: (val, row) => val ? `${val} #${row.target_id}` : '-' },
    { key: 'ip_address', label: 'IP Address', render: (val) => <span className="text-xs font-mono text-slate-500">{val || '-'}</span> },
    { key: 'status', label: 'Status', render: (val) => (
      <span className={`text-xs font-medium ${val === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>{val}</span>
    )},
    { key: 'created_at', label: 'Date', render: (val) => (
      <div><p className="text-sm">{new Date(val).toLocaleDateString()}</p><p className="text-xs text-slate-400">{new Date(val).toLocaleTimeString()}</p></div>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-slate-600" />
        <h2 className="text-xl font-bold text-slate-800">Audit Logs</h2>
      </div>
      <DataTable
        columns={columns}
        data={data}
        totalCount={total}
        page={page}
        pageSize={20}
        onPageChange={setPage}
        loading={loading}
        emptyMessage="No audit logs found"
      />
    </div>
  );
}
