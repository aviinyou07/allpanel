'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { UserCog, Users, Coins, ArrowLeftRight, Activity, UserCheck } from 'lucide-react';

export default function SupremeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/reports/overview');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  const stats = data?.stats || {};
  const recentTxns = data?.recentTransactions || [];

  const formatCoins = (val) => Number(val || 0).toLocaleString('en-IN');

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Super Admins" value={stats.totalSuperAdmins} icon={UserCog} color="blue" />
        <StatCard title="Total Masters" value={stats.totalMasters} icon={Users} color="purple" />
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="green" />
        <StatCard title="Total Coins Distributed" value={formatCoins(stats.totalCoinsDistributed)} icon={Coins} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
            <a href="/supreme/transactions" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</a>
          </div>
          <div className="divide-y divide-slate-50">
            {recentTxns.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">No transactions yet</p>
            ) : (
              recentTxns.slice(0, 6).map((txn, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      ${txn.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {txn.type === 'CREDIT' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {txn.from_username || 'System'} → {txn.to_username || '-'}
                      </p>
                      <p className="text-xs text-slate-400">{txn.txn_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{formatCoins(txn.amount)}</p>
                    <p className="text-xs text-slate-400">{new Date(txn.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Quick Stats</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-slate-600">Today's Transactions</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{stats.todayTransactions}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-slate-600">Active Users</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{stats.activeUsers}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-slate-600">Total Hierarchy</span>
              </div>
              <span className="text-sm font-bold text-slate-800">
                {(stats.totalSuperAdmins || 0) + (stats.totalMasters || 0) + (stats.totalUsers || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
