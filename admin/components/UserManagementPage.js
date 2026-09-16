'use client';

import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import CreateUserModal from '@/components/CreateUserModal';
import CoinTransferModal from '@/components/CoinTransferModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useToast } from '@/components/Toast';
import { Plus, Coins, Edit, Trash2, Power, Eye } from 'lucide-react';

export default function UserManagementPage({ targetRole, title, createLabel }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [transferTarget, setTransferTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [myWallet, setMyWallet] = useState(null);
  const [myRole, setMyRole] = useState('');
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, pageSize: 10, role: targetRole, search });
      const res = await fetch(`/api/users?${params}`);
      const json = await res.json();
      setData(json.data || []);
      setTotal(json.total || 0);
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, targetRole]);

  const fetchWallet = useCallback(async () => {
    const [walletRes, meRes] = await Promise.all([
      fetch('/api/wallet'),
      fetch('/api/auth/me'),
    ]);
    const wallet = await walletRes.json();
    const me = await meRes.json();
    setMyWallet(wallet);
    setMyRole(me.user?.role || '');
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchWallet(); }, [fetchWallet]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`${deleteTarget.full_name} deleted successfully`, 'success');
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Delete failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
    setDeleteTarget(null);
  };

  const handleStatusToggle = async () => {
    if (!statusTarget) return;
    const newStatus = statusTarget.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch(`/api/users/${statusTarget.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`${statusTarget.full_name} ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`, 'success');
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Status update failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
    setStatusTarget(null);
  };

  const columns = [
    { key: 'full_name', label: 'Name', render: (val, row) => (
      <div>
        <p className="font-medium text-slate-800">{val}</p>
        <p className="text-xs text-slate-400">@{row.username}</p>
      </div>
    )},
    { key: 'mobile', label: 'Mobile', render: (val) => val || '-' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'balance', label: 'Balance', render: (val) => (
      <span className="font-medium">{Number(val || 0).toLocaleString('en-IN')}</span>
    )},
    { key: 'total_received', label: 'Received', render: (val) => Number(val || 0).toLocaleString('en-IN') },
    { key: 'created_at', label: 'Created', render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {createLabel}
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        totalCount={total}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder={`Search ${title.toLowerCase()}...`}
        loading={loading}
        emptyMessage={`No ${title.toLowerCase()} found`}
        actions={(row) => (
          <>
            <button
              onClick={() => setTransferTarget(row)}
              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
              title="Transfer Coins"
            >
              <Coins className="w-4 h-4" />
            </button>
            <button
              onClick={() => setStatusTarget(row)}
              className={`p-1.5 rounded-lg transition-colors ${
                row.status === 'ACTIVE' ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-green-50 text-green-600'
              }`}
              title={row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            >
              <Power className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteTarget(row)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={() => { fetchData(); showToast(`${createLabel.replace('Create ', '')} created successfully`, 'success'); }}
        targetRole={targetRole}
      />

      <CoinTransferModal
        isOpen={!!transferTarget}
        onClose={() => setTransferTarget(null)}
        onTransfer={() => { fetchData(); fetchWallet(); showToast('Coins transferred successfully', 'success'); }}
        receiver={transferTarget}
        senderBalance={myWallet?.balance || 0}
        senderRole={myRole}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Account"
        message={`Are you sure you want to delete "${deleteTarget?.full_name}"? This action will soft-delete the account.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />

      <ConfirmDialog
        isOpen={!!statusTarget}
        title={statusTarget?.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
        message={`Are you sure you want to ${statusTarget?.status === 'ACTIVE' ? 'deactivate' : 'activate'} "${statusTarget?.full_name}"?`}
        confirmLabel={statusTarget?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        onConfirm={handleStatusToggle}
        onCancel={() => setStatusTarget(null)}
        variant={statusTarget?.status === 'ACTIVE' ? 'warning' : 'primary'}
      />
    </div>
  );
}
