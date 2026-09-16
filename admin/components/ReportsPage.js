'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import { Users, Coins, ArrowLeftRight, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/overview').then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-40 bg-white rounded-xl" /></div>;

  const stats = data?.stats || {};
  const fmt = (v) => Number(v || 0).toLocaleString('en-IN');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Reports</h2>

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
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Transaction Summary</h3>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-500">
            {data?.recentTransactions?.length || 0} recent transactions recorded.
          </p>
        </div>
      </div>
    </div>
  );
}
