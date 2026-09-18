import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/api';
import { Settings as SettingsIcon, Server, Shield, Check, RefreshCw, Key, Lock, Cpu } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('solwin_custom_api_url', apiUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6 mx-auto pb-12">
      <div className="pb-4 border-b border-surface-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-brand-cyan">
            ENVIRONMENT TELEMETRY
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
          <SettingsIcon size={22} className="text-brand-cyan" />
          <span>Platform Configuration & Gateway Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage REST API integration endpoints, analyst session authentication, and diagnostic telemetry
        </p>
      </div>

      {/* Backend API Configuration */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border shadow-card space-y-4">
        <div className="flex items-center gap-2 text-white">
          <Server size={18} className="text-brand-cyan" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
            Backend REST API Connection
          </h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The SOLWIN frontend communicates strictly with your Python/FastAPI backend over REST. All classification, sentiment, and threat vectors are retrieved live.
        </p>

        <form onSubmit={handleSave} className="space-y-4 max-w-xl">
          <div>
            <label className="text-xs font-mono font-medium text-slate-300 block mb-1">
              Active Gateway Base URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-xs font-mono text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/40 shadow-sm"
            />
            <span className="text-[11px] text-slate-500 font-mono mt-1.5 block">
              Default: http://localhost:8000/api/v1
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold font-mono uppercase tracking-wider shadow-glow-cyan/25 transition-all"
            >
              Update Gateway Endpoint
            </button>
            {saved && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Check size={14} /> Saved successfully
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Analyst Profile Information */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border shadow-card space-y-4">
        <div className="flex items-center gap-2 text-white">
          <Shield size={18} className="text-brand-cyan" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
            Operator Session Security Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-elevated/70 border border-surface-border">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">Operator Identity</span>
            <span className="font-semibold text-slate-100">{user?.name}</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated/70 border border-surface-border">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">Authorized Email</span>
            <span className="font-mono text-brand-cyan">{user?.email}</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated/70 border border-surface-border">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">Assigned RBAC Role</span>
            <span className="font-mono text-emerald-400 uppercase font-bold">{user?.role}</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated/70 border border-surface-border">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">Session Protocol</span>
            <span className="font-mono text-slate-300">JWT Bearer Interceptor Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
