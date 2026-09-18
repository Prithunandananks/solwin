import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/api';
import { Settings as SettingsIcon, Server, Shield, Check, RefreshCw } from 'lucide-react';

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
    <div className="max-w-4xl space-y-6">
      <div className="pb-3 border-b border-surface-border">
        <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
          <SettingsIcon size={20} className="text-slate-400" />
          <span>PLATFORM CONFIGURATION & SETTINGS</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage REST API integration endpoints, analyst session profile, and diagnostic telemetry
        </p>
      </div>

      {/* Backend API Configuration */}
      <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-brand-blue">
          <Server size={18} />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Backend REST API Connection
          </h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The SOLWIN frontend strictly communicates with your Python/FastAPI backend over REST. Configure the active gateway endpoint below.
        </p>

        <form onSubmit={handleSave} className="space-y-4 max-w-xl">
          <div>
            <label className="text-xs font-mono font-medium text-slate-300 block mb-1">
              Gateway Base URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-blue"
            />
            <span className="text-[11px] text-slate-500 font-mono mt-1 block">
              Default: http://localhost:8000/api/v1
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-semibold font-mono uppercase tracking-wider shadow-glow-sm transition-all"
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
      <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Shield size={18} />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Operator Session Credentials
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">Operator Name</span>
            <span className="font-semibold text-slate-200">{user?.name}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">Authorized Email</span>
            <span className="font-mono text-slate-200">{user?.email}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">Assigned Role</span>
            <span className="font-mono text-emerald-400 uppercase font-bold">{user?.role}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 block mb-1">Session Security</span>
            <span className="font-mono text-slate-300">JWT Bearer Interceptor Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
