'use client';

import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/DataTable';
import { FileText, Eye, X } from 'lucide-react';

export default function AuditLogsPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, pageSize: 20 });
      if (action) params.set('action', action);
      if (search) params.set('search', search);
      const res = await fetch(`/api/audit-logs?${params}`);
      const json = await res.json();
      setData(json.data || []);
      setTotal(json.total || 0);
    } catch {} finally { setLoading(false); }
  }, [page, action, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    { key: 'actor_username', label: 'Actor', render: (val, row) => (
      <div>
        <p className="text-sm font-medium text-slate-700">{val || 'System'}</p>
        <p className="text-xs text-slate-400">{row.actor_role || 'SYSTEM'}</p>
      </div>
    )},
    { key: 'action', label: 'Action', render: (val) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 font-mono">{val}</span>
    )},
    { key: 'target_type', label: 'Target', render: (val, row) => val ? `${val} #${row.target_id || ''}` : '-' },
    { key: 'ip_address', label: 'IP Address', render: (val) => <span className="text-xs font-mono text-slate-500">{val || '-'}</span> },
    { key: 'status', label: 'Status', render: (val) => (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${val === 'SUCCESS' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{val}</span>
    )},
    { key: 'details', label: 'Details', render: (val, row) => (
      <button
        onClick={() => setSelectedLog(row)}
        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
      >
        <Eye className="w-3.5 h-3.5" />
        View
      </button>
    )},
    { key: 'created_at', label: 'Date', render: (val) => (
      <div>
        <p className="text-sm">{new Date(val).toLocaleDateString()}</p>
        <p className="text-xs text-slate-400">{new Date(val).toLocaleTimeString()}</p>
      </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-600" />
          <h2 className="text-xl font-bold text-slate-800">Audit Logs</h2>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-500">Filter Action:</label>
          <select
            value={action}
            onChange={(e) => { setAction(e.target.value); setPage(1); }}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGIN_FAILED">LOGIN_FAILED</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="CREATE_ACCOUNT">CREATE_ACCOUNT</option>
            <option value="UPDATE_ACCOUNT">UPDATE_ACCOUNT</option>
            <option value="DELETE_ACCOUNT">DELETE_ACCOUNT</option>
            <option value="ACTIVATE_ACCOUNT">ACTIVATE_ACCOUNT</option>
            <option value="DEACTIVATE_ACCOUNT">DEACTIVATE_ACCOUNT</option>
            <option value="COIN_TRANSFER">COIN_TRANSFER</option>
            <option value="UPDATE_GAME_SETTINGS">UPDATE_GAME_SETTINGS</option>
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
        searchPlaceholder="Search by action, actor, IP..."
        loading={loading}
        emptyMessage="No audit logs found"
      />

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedLog(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Audit Log Details #{selectedLog.id}
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Action:</span>
                <span className="font-semibold text-slate-800">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Actor:</span>
                <span className="font-semibold text-slate-800">{selectedLog.actor_username || 'System'} ({selectedLog.actor_role || 'SYSTEM'})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Target:</span>
                <span className="text-slate-800">{selectedLog.target_type ? `${selectedLog.target_type} #${selectedLog.target_id}` : 'None'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">IP Address:</span>
                <span className="font-mono text-slate-700">{selectedLog.ip_address || '-'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Timestamp:</span>
                <span className="text-slate-700">{new Date(selectedLog.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Payload Details</p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-56">
                {typeof selectedLog.details === 'object'
                  ? JSON.stringify(selectedLog.details, null, 2)
                  : (() => {
                      try { return JSON.stringify(JSON.parse(selectedLog.details), null, 2); }
                      catch { return String(selectedLog.details || 'No details'); }
                    })()}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
