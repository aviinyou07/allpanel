'use client';

import { useState, useEffect } from 'react';
import { Gamepad2, Clock, Play, Pause } from 'lucide-react';

export default function DragonTigerManagementPage() {
  const [settings, setSettings] = useState({});
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/game/config').then(r => r.json()),
      fetch('/api/game/rounds?pageSize=20').then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([config, roundsData]) => {
      const map = {};
      (config.settings || []).forEach(s => { map[s.setting_key] = s.setting_value; });
      setSettings(map);
      setRounds(roundsData.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-40 bg-white rounded-xl" /><div className="h-60 bg-white rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Gamepad2 className="w-5 h-5 text-slate-600" />
        <h2 className="text-xl font-bold text-slate-800">Dragon Tiger Management</h2>
      </div>

      {/* Game Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 font-medium">Game Status</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2.5 h-2.5 rounded-full ${settings.game_enabled === 'true' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-lg font-bold text-slate-800">{settings.game_enabled === 'true' ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 font-medium">Provider</p>
          <p className="text-lg font-bold text-slate-800 mt-2 capitalize">{settings.game_provider || 'Demo'}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 font-medium">Round Duration</p>
          <p className="text-lg font-bold text-slate-800 mt-2">{settings.round_duration || 30}s</p>
        </div>
      </div>

      {/* Bet Limits */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Bet Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500">Min Bet</p>
            <p className="text-sm font-bold text-slate-800">{Number(settings.min_bet || 100).toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Max Bet</p>
            <p className="text-sm font-bold text-slate-800">{Number(settings.max_bet || 100000).toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Dragon/Tiger Payout</p>
            <p className="text-sm font-bold text-slate-800">{settings.dragon_payout || 2}x</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Tie Payout</p>
            <p className="text-sm font-bold text-slate-800">{settings.tie_payout || 12}x</p>
          </div>
        </div>
      </div>

      {/* Round History */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Recent Rounds</h3>
        </div>
        {rounds.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">No rounds played yet</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {rounds.map((round, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white
                    ${round.result === 'DRAGON' ? 'bg-red-500' : round.result === 'TIGER' ? 'bg-blue-500' : 'bg-green-500'}`}>
                    {round.result?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Round #{round.round_id}</p>
                    <p className="text-xs text-slate-400">{round.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">{round.result || 'Pending'}</p>
                  <p className="text-xs text-slate-400">{new Date(round.started_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
