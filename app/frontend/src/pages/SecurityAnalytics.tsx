import React, { useState, useEffect } from 'react';
import { getSecurityAnalytics } from '../services/analyticsApi';
import { SecurityAnalytics as SecAnalyticsType } from '../types/analytics';
import { ChartSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { ShieldAlert, LineChart, Radio, Globe, RefreshCw, AlertTriangle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const SecurityAnalytics: React.FC = () => {
  const [data, setData] = useState<SecAnalyticsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getSecurityAnalytics();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch security analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <ErrorState title="Security Analytics Unavailable" message={error || ''} onRetry={loadData} />;
  }

  const RISK_COLORS: Record<string, string> = {
    LOW: '#10b981',
    MEDIUM: '#f59e0b',
    HIGH: '#f97316',
    CRITICAL: '#f43f5e',
  };

  const CustomDarkTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-elevated/95 border border-surface-border rounded-xl p-3 shadow-dropdown text-xs backdrop-blur-md">
          <p className="font-mono text-slate-400 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="font-mono text-xs flex items-center justify-between gap-4" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span className="font-bold text-white">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-rose-400">
              SIEM & THREAT METRICS ENGINE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
            <LineChart size={22} className="text-rose-400" />
            <span>Security Operations & Threat Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Forensic analysis of adversary velocity, social engineering attack vectors, IOC domain telemetry, and risk stratification.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-elevated text-slate-400 hover:text-slate-100 transition-all self-start sm:self-auto shadow-sm"
          title="Refresh metrics"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Row 1: Threats Over Time & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threats Over Time */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Threat Velocity Over Time (7-Day Incident Trend)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Phishing vs Credential Theft vs Social Engineering</p>
            </div>
            <span className="text-[10px] font-mono font-semibold text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30">
              INCIDENTS
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.threats_over_time}>
                <defs>
                  <linearGradient id="colorPhish" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomDarkTooltip />} />
                <Area
                  type="monotone"
                  dataKey="phishing"
                  name="Phishing Lures"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPhish)"
                />
                <Area
                  type="monotone"
                  dataKey="credential_theft"
                  name="Credential Theft"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCred)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Level Stratification */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Active Risk Level Stratification
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Critical vs High vs Medium vs Low Distribution</p>
            </div>
            <span className="text-[10px] font-mono font-semibold text-brand-cyan bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              SECTOR SCAN
            </span>
          </div>

          <div className="h-72 w-full pt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.risk_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.risk_distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={RISK_COLORS[entry.name.toUpperCase()] || '#6366f1'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomDarkTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-xs font-mono text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Attack Classification & MITRE Tactics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Types Breakdown */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Threat Classification Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Frequency by specific vector category</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">SIEM Aggregate</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.threat_types} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} width={120} />
                <Tooltip content={<CustomDarkTooltip />} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Suspicious Lookalike Domains List */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Identified Malicious Domains & IOCs
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Rogue domains flagged across incoming messages</p>
            </div>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/25">
              AUTO-QUARANTINE
            </span>
          </div>

          <div className="space-y-2.5 pt-1 overflow-y-auto max-h-64">
            {data.suspicious_domains.map((dom, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated/70 border border-surface-border text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <Globe size={14} className="text-rose-400 shrink-0" />
                  <span className="font-mono text-slate-200 truncate">{dom.domain}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400">{dom.detections} detections</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold">
                    {dom.risk_level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
