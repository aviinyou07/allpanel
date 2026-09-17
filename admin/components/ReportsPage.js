'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { Users, Coins, ArrowLeftRight, TrendingUp, BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/overview')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-40 bg-white rounded-xl" /><div className="h-60 bg-white rounded-xl" /></div>;

  const stats = data?.stats || {};
  const recentTxns = data?.recentTransactions || [];
  const fmt = (v) => Number(v || 0).toLocaleString('en-IN');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-800">System Reports & Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.totalSuperAdmins !== undefined && (
          <StatCard title="Super Admins" value={stats.totalSuperAdmins} icon={Users} color="blue" />
        )}
        {stats.totalMasters !== undefined && (
          <StatCard title="Masters" value={stats.totalMasters} icon={Users} color="purple" />
        )}
        {stats.totalUsers !== undefined && (
          <StatCard title="Users" value={stats.totalUsers} icon={Users} color="green" />
        )}
        {stats.totalCoinsDistributed !== undefined && (
          <StatCard title="Total Coins Distributed" value={fmt(stats.totalCoinsDistributed)} icon={Coins} color="amber" />
        )}
        {stats.coinsReceived !== undefined && (
          <StatCard title="Coins Received" value={fmt(stats.coinsReceived)} icon={Coins} color="teal" />
        )}
        {stats.availableCoins !== undefined && (
          <StatCard title="Available Coins" value={fmt(stats.availableCoins)} icon={Coins} color="indigo" />
        )}
        {stats.coinsDistributed !== undefined && (
          <StatCard title="Coins Distributed" value={fmt(stats.coinsDistributed)} icon={TrendingUp} color="amber" />
        )}
        {stats.todayTransactions !== undefined && (
          <StatCard title="Today's Transactions" value={stats.todayTransactions} icon={ArrowLeftRight} color="cyan" />
        )}
      </div>

      {/* Recent transactions summary */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Recent Transactions Summary</h3>
          <span className="text-xs text-slate-500">{recentTxns.length} records</span>
        </div>
        {recentTxns.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">No transactions recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Txn ID</th>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTxns.map((txn, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{txn.txn_id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{txn.from_username || 'System'}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{txn.to_username || '-'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{fmt(txn.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        txn.type === 'CREDIT' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={txn.status} /></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(txn.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
