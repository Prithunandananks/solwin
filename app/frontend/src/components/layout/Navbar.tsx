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
    <header className="h-16 border-b border-white/[0.08] bg-[#070a14]/85 backdrop-blur-xl sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between shadow-sm">
      {/* Brand & SOC Indicator */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-surface-elevated/70 lg:hidden transition-colors border border-transparent hover:border-white/10"
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>

        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-blue flex items-center justify-center text-white border border-indigo-400/30 shadow-glow-sm group-hover:scale-105 transition-transform">
            <Shield size={18} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-sm text-white font-sans">SOLWIN</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-brand-blue/15 text-brand-cyan border border-brand-blue/25 font-semibold tracking-wide">
                SOC-AI
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline leading-none mt-0.5">
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
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card/90 border border-white/[0.08] text-xs text-slate-300 shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] tracking-tight text-slate-300">Live Grid</span>
        </div>

        {/* Security Alerts Bell */}
        <button
          className="relative p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-surface-elevated/70 border border-white/[0.06] transition-all"
          title="Security alerts"
          onClick={() => navigate('/threats')}
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-background shadow-glow-danger" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-surface-elevated/80 border border-white/[0.06] transition-colors"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover border border-brand-blue/40"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-surface-elevated flex items-center justify-center text-slate-300 border border-white/10 font-mono font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
            )}
            <div className="hidden lg:block text-left text-xs pr-1">
              <div className="font-semibold text-slate-100 leading-tight">{user?.name || 'Lead Analyst'}</div>
              <div className="text-[10px] text-brand-cyan font-mono capitalize">
                {user?.role ? user.role.replace('_', ' ') : 'SecOps Tier-3'}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-surface-card/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3.5 py-2.5 border-b border-white/10">
                <p className="text-xs font-semibold text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate font-mono mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-surface-elevated transition-colors flex items-center justify-between"
              >
                <span>Platform Settings</span>
                <span className="text-[10px] font-mono text-slate-500">API config</span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 transition-colors border-t border-white/10 mt-1"
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

