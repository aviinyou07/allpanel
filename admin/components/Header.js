'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ChevronDown, LogOut, User } from 'lucide-react';

export default function Header({ user, wallet, onMenuClick, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleLabel = {
    SUPREME: 'Supreme',
    SUPER_ADMIN: 'Super Admin',
    MASTER: 'Master',
    USER: 'User',
  };

  const formatCoins = (amount) => {
    if (user.role === 'SUPREME') return '∞';
    return Number(amount || 0).toLocaleString('en-IN');
  };

  return (
    <header className="bg-white border-b border-admin-border px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-slate-800 leading-tight">
            Welcome, {user.fullName || user.username}
          </h2>
          <p className="text-xs text-slate-500">
            {roleLabel[user.role]} • Balance: <span className="font-semibold text-slate-700">{formatCoins(wallet?.balance)}</span>
          </p>
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user.fullName?.charAt(0) || 'A'}
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-700">{user.fullName || user.username}</span>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">{user.fullName}</p>
                <p className="text-xs text-slate-500">@{user.username}</p>
                <p className="text-xs text-blue-600 font-medium mt-0.5">{roleLabel[user.role]}</p>
              </div>
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs text-slate-500">Balance</p>
                <p className="text-sm font-bold text-slate-800">{formatCoins(wallet?.balance)} Coins</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
