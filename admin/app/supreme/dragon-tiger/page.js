'use client';

import { useState, useEffect, useCallback } from 'react';
import { Gamepad2, Play, Pause, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function DragonTigerManagementPage() {
  const [settings, setSettings] = useState({});
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const { showToast } = useToast();

  const fetchGameData = useCallback(async () => {
    try {
      const [configRes, roundsRes] = await Promise.all([
        fetch('/api/game/config'),
        fetch('/api/game/rounds?pageSize=20'),
      ]);

      const config = await configRes.json();
      const roundsData = await roundsRes.json();

      const map = {};
      (config.settings || []).forEach(s => { map[s.setting_key] = s.setting_value; });
      setSettings(map);
      setRounds(roundsData.data || []);
    } catch {
      showToast('Failed to load game data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  const handleToggleGame = async () => {
    const isCurrentlyEnabled = settings.game_enabled === 'true';
    const nextState = isCurrentlyEnabled ? 'false' : 'true';
    setToggling(true);

    try {
      const res = await fetch('/api/game/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            ...settings,
            game_enabled: nextState,
          },
        }),
      });

      if (res.ok) {
        setSettings(prev => ({ ...prev, game_enabled: nextState }));
        showToast(`Game has been ${nextState === 'true' ? 'enabled' : 'disabled'}`, 'success');
      } else {
        showToast('Failed to update game status', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-40 bg-white rounded-xl" /><div className="h-60 bg-white rounded-xl" /></div>;

  const isEnabled = settings.game_enabled === 'true';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-800">Dragon Tiger Management</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchGameData}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            Refresh
          </button>
          <button
            onClick={handleToggleGame}
            disabled={toggling}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-lg text-white transition-colors ${
              isEnabled ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400' : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
            }`}
          >
            {isEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {toggling ? 'Updating...' : isEnabled ? 'Disable Game' : 'Enable Game'}
          </button>
        </div>
      </div>

      {/* Game Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 font-medium">Game Status</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-lg font-bold text-slate-800">{isEnabled ? 'Live & Accepting Bets' : 'Disabled'}</span>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isEnabled ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {isEnabled ? 'Active' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 font-medium">Provider</p>
          <p className="text-lg font-bold text-slate-800 mt-2 capitalize">{settings.game_provider || 'Demo Provider'}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500 font-medium">Round Duration</p>
          <p className="text-lg font-bold text-slate-800 mt-2">{settings.round_duration || 30} seconds</p>
        </div>
      </div>

      {/* Bet Limits & Payouts */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Bet Configuration & Payouts</h3>
          <a href="/supreme/settings" className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
            Edit in Settings →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Min Bet</p>
            <p className="text-sm font-bold text-slate-800">{Number(settings.min_bet || 10).toLocaleString('en-IN')} Coins</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Max Bet</p>
            <p className="text-sm font-bold text-slate-800">{Number(settings.max_bet || 100000).toLocaleString('en-IN')} Coins</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Dragon Payout</p>
            <p className="text-sm font-bold text-red-600">{settings.dragon_payout || 2}x</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Tiger Payout</p>
            <p className="text-sm font-bold text-blue-600">{settings.tiger_payout || 2}x</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Tie Payout</p>
            <p className="text-sm font-bold text-green-600">{settings.tie_payout || 12}x</p>
          </div>
        </div>
      </div>

      {/* Round History */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Recent Rounds History</h3>
          <span className="text-xs text-slate-500">Showing last {rounds.length} rounds</span>
        </div>
        {rounds.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">No rounds played yet</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {rounds.map((round, i) => {
              const res = round.result;
              const isTie = res === 'TIE';
              const isDragon = res === 'DRAGON';
              const isTiger = res === 'TIGER';
              const badgeLabel = isDragon ? 'D' : isTiger ? 'T' : isTie ? 'Tie' : '?';
              const badgeBg = isDragon ? 'bg-red-500' : isTiger ? 'bg-blue-500' : isTie ? 'bg-green-500' : 'bg-slate-400';

              return (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${badgeBg}`}>
                      {badgeLabel}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Round #{round.round_id}</p>
                      <p className="text-xs text-slate-400">
                        Cards: Dragon <span className="font-medium text-slate-700">{round.dragon_card || '-'}</span> vs Tiger <span className="font-medium text-slate-700">{round.tiger_card || '-'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      round.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {round.result ? `${round.result} WIN` : round.status}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(round.started_at).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
