'use client';

import { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Coins } from 'lucide-react';

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/wallet').then(r => r.json()),
      fetch('/api/transactions?pageSize=10').then(r => r.json()),
    ]).then(([w, t]) => {
      setWallet(w);
      setRecentTxns(t.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-40 bg-white rounded-xl" /><div className="h-60 bg-white rounded-xl" /></div>;

  const fmt = (v) => Number(v || 0).toLocaleString('en-IN');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Wallet / Credits</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 opacity-80" />
            <span className="text-sm font-medium opacity-80">Available Balance</span>
          </div>
          <p className="text-3xl font-bold">{wallet?.isUnlimited ? '∞' : fmt(wallet?.balance)}</p>
          {wallet?.isUnlimited && <p className="text-sm opacity-70 mt-1">Unlimited Coins</p>}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownLeft className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-slate-500">Total Received</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{fmt(wallet?.totalReceived)}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-slate-500">Total Distributed</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{fmt(wallet?.totalDistributed)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {recentTxns.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">No transactions yet</p>
          ) : (
            recentTxns.map((txn, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${txn.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {txn.type === 'CREDIT' ? '+' : '-'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{txn.from_username} → {txn.to_username}</p>
                    <p className="text-xs text-slate-400">{txn.txn_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.type === 'CREDIT' ? '+' : '-'}{fmt(txn.amount)}
                  </p>
                  <p className="text-xs text-slate-400">{new Date(txn.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
