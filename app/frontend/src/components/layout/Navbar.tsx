import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell, LogOut, Menu, UserCircle, Activity, Sparkles, Terminal, AlertTriangle, CheckCircle2, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SearchBar } from '../common/SearchBar';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [defconLevel, setDefconLevel] = useState<'NORMAL' | 'ELEVATED' | 'CRITICAL'>('NORMAL');
  const [showAlertsPopover, setShowAlertsPopover] = useState(false);

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

  const cycleDefcon = () => {
    if (defconLevel === 'NORMAL') setDefconLevel('ELEVATED');
    else if (defconLevel === 'ELEVATED') setDefconLevel('CRITICAL');
    else setDefconLevel('NORMAL');
  };

  return (
    <header className="h-16 border-b border-surface-border bg-surface-card/90 backdrop-blur-xl sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between shadow-card transition-colors duration-200">
      {/* Brand & SOC Indicator */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-surface-elevated lg:hidden transition-colors border border-transparent hover:border-surface-border"
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>

        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-glow-cyan group-hover:scale-105 transition-transform">
            <Shield size={18} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-sm font-sans">SOLWIN</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 font-semibold tracking-wider">
                SOC-AI
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline leading-none mt-0.5">
              Defense Intelligence v2.4
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
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Interactive Defcon Trigger for Hackathon Demo */}
        <button
          onClick={cycleDefcon}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all shadow-sm ${
            defconLevel === 'NORMAL'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
              : defconLevel === 'ELEVATED'
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 hover:bg-amber-500/25 shadow-glow-amber'
              : 'bg-rose-500/20 border-rose-500/50 text-rose-500 hover:bg-rose-500/30 shadow-glow-rose animate-pulse'
          }`}
          title="Click to toggle simulated SOC Defcon level"
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              defconLevel === 'NORMAL' ? 'bg-emerald-400' : defconLevel === 'ELEVATED' ? 'bg-amber-400' : 'bg-rose-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              defconLevel === 'NORMAL' ? 'bg-emerald-500' : defconLevel === 'ELEVATED' ? 'bg-amber-500' : 'bg-rose-500'
            }`}></span>
          </span>
          <span className="text-[11px] font-bold">DEFCON: {defconLevel}</span>
        </button>

        {/* Theme Switcher Button (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-surface-border bg-surface-elevated/70 hover:bg-surface-elevated text-slate-400 hover:text-slate-100 transition-all shadow-sm flex items-center justify-center group"
          title={`Switch to ${theme === 'dark' ? 'Light (Minimalist)' : 'Dark (Obsidian SOC)'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={17} className="text-amber-400 group-hover:rotate-45 transition-transform" />
          ) : (
            <Moon size={17} className="text-indigo-600 group-hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Security Alerts Bell with Popover */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsPopover(!showAlertsPopover)}
            className="relative p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-surface-elevated border border-surface-border transition-all"
            title="Active security threats"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-surface-card shadow-glow-rose" />
          </button>

          {showAlertsPopover && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-card border border-surface-border rounded-2xl shadow-dropdown p-3.5 z-50 animate-in fade-in space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                  <AlertTriangle size={13} /> High Priority Alerts
                </span>
                <span className="text-[10px] font-mono text-slate-500">Live feed</span>
              </div>
              <div className="space-y-2 text-xs">
                <div
                  onClick={() => {
                    setShowAlertsPopover(false);
                    navigate('/threats/THR-9021');
                  }}
                  className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 hover:border-rose-500/45 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-rose-500 font-bold text-[11px]">THR-9021</span>
                    <span className="text-[10px] text-rose-400 font-mono">2 min ago</span>
                  </div>
                  <p className="text-xs">Spear-phishing & 2FA harvesting on cloud-login.net</p>
                </div>

                <div
                  onClick={() => {
                    setShowAlertsPopover(false);
                    navigate('/campaigns/CMP-041');
                  }}
                  className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/25 hover:border-violet-500/45 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-violet-500 font-bold text-[11px]">CMP-041</span>
                    <span className="text-[10px] text-violet-400 font-mono">14 min ago</span>
                  </div>
                  <p className="text-xs">Coordinated wave targeting accounting personnel</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAlertsPopover(false);
                  navigate('/threats');
                }}
                className="w-full py-1.5 rounded-lg bg-surface-elevated hover:bg-slate-800 text-xs font-mono text-center block transition-colors border border-surface-border"
              >
                View all active threats →
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-surface-elevated border border-surface-border transition-colors"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover border border-surface-border"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-brand-cyan border border-cyan-500/30 font-mono font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
            )}
            <div className="hidden lg:block text-left text-xs pr-1">
              <div className="font-semibold leading-tight">{user?.name || 'Lead Analyst'}</div>
              <div className="text-[10px] text-slate-500 font-mono capitalize">
                {user?.role ? user.role.replace('_', ' ') : 'SecOps Tier-3'}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-card border border-surface-border rounded-2xl shadow-dropdown py-2 z-50 animate-in fade-in">
              <div className="px-3.5 py-2 border-b border-surface-border">
                <p className="text-xs font-semibold">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-3.5 py-2 text-xs hover:bg-surface-elevated transition-colors flex items-center justify-between"
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
                className="w-full text-left px-3.5 py-2 text-xs text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 transition-colors border-t border-surface-border mt-1"
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
