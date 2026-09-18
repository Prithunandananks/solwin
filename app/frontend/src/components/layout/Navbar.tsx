import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell, LogOut, Menu, UserCircle, Activity, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../common/SearchBar';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleGlobalSearch = (query: string) => {
    if (!query.trim()) return;
    if (query.toUpperCase().startsWith('THR-')) {
      navigate(`/threats?search=${encodeURIComponent(query)}`);
    } else if (query.toUpperCase().startsWith('CMP-')) {
      navigate(`/campaigns`);
    } else {
      navigate(`/conversations?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between shadow-sm">
      {/* Brand & SOC Indicator */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden transition-colors border border-transparent hover:border-slate-200"
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>

        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Shield size={18} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-sm text-slate-900 font-sans">SOLWIN</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold tracking-wide">
                SOC-AI
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline leading-none mt-0.5">
              Intelligence Core v2.4
            </span>
          </div>
        </div>
      </div>

      {/* Global search with hotkey hint */}
      <div className="flex-1 max-w-lg mx-6 hidden md:block">
        <div className="relative group">
          <SearchBar
            placeholder="Search tickets, threat vectors, IOC domains, customer hashes..."
            onChange={handleGlobalSearch}
            className="w-full"
          />
        </div>
      </div>

      {/* Right controls & Telemetry status */}
      <div className="flex items-center gap-3.5">
        {/* Heartbeat SOC Telemetry Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] tracking-tight text-slate-700 font-medium">Live Grid</span>
        </div>

        {/* Security Alerts Bell */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-all"
          title="Security alerts"
          onClick={() => navigate('/threats')}
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white shadow-sm" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-colors"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200 font-mono font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
            )}
            <div className="hidden lg:block text-left text-xs pr-1">
              <div className="font-semibold text-slate-900 leading-tight">{user?.name || 'Lead Analyst'}</div>
              <div className="text-[10px] text-slate-500 font-mono capitalize">
                {user?.role ? user.role.replace('_', ' ') : 'SecOps Tier-3'}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-dropdown py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>Platform Settings</span>
                <span className="text-[10px] font-mono text-slate-400">API config</span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors border-t border-slate-100 mt-1"
              >
                <LogOut size={13} />
                <span>Terminate Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

