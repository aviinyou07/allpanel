'use client';

import Link from 'next/link';
import { getSidebarItems } from '@/lib/rbac';
import {
  LayoutDashboard, UserCog, Users, Wallet, ArrowLeftRight,
  Gamepad2, BarChart3, Settings, FileText, LogOut, Shield
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, UserCog, Users, Wallet, ArrowLeftRight,
  Gamepad2, BarChart3, Settings, FileText,
};

export default function Sidebar({ user, isOpen, onClose, onLogout, currentPath }) {
  const items = getSidebarItems(user.role);

  const roleLabel = {
    SUPREME: 'Supreme',
    SUPER_ADMIN: 'Super Admin',
    MASTER: 'Master',
    USER: 'User',
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-[250px] bg-sidebar-bg z-50 flex flex-col transition-transform duration-300
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base tracking-tight leading-tight">DRAGON TIGER</h1>
            <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
            {user.fullName?.charAt(0) || user.username?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user.fullName || user.username}</p>
            <p className="text-slate-500 text-xs">{roleLabel[user.role]}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = currentPath === item.href || currentPath?.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
