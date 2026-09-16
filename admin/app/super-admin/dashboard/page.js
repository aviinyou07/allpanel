'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import { Users, Coins, Wallet, ArrowLeftRight } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/overview').then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const stats = data?.stats || {};
  const recentTxns = data?.recentTransactions || [];
  const fmt = (v) => Number(v || 0).toLocaleString('en-IN');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Masters" value={stats.totalMasters} icon={Users} color="blue" />
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="green" />
        <StatCard title="Coins Received" value={fmt(stats.coinsReceived)} icon={Coins} color="amber" />
        <StatCard title="Available Coins" value={fmt(stats.availableCoins)} icon={Wallet} color="purple" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
          <a href="/super-admin/transactions" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</a>
        </div>
        <div className="divide-y divide-slate-50">
          {recentTxns.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">No transactions yet</p>
          ) : (
            recentTxns.slice(0, 8).map((txn, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${txn.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {txn.type === 'CREDIT' ? '+' : '-'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{txn.from_username} → {txn.to_username}</p>
                    <p className="text-xs text-slate-400">{txn.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">{fmt(txn.amount)}</p>
                  <p className="text-xs text-slate-400">{new Date(txn.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-24 animate-pulse">
            <div className="h-3 bg-slate-100 rounded w-24 mb-3" />
            <div className="h-6 bg-slate-100 rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
