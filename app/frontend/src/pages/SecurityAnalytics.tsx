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
      <div className="space-y-6">
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
    CRITICAL: '#ef4444',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-rose-400">
              SIEM & THREAT ANALYTICS
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
          className="p-2.5 rounded-xl border border-white/10 bg-surface-card hover:bg-surface-elevated text-slate-400 hover:text-white transition-all self-start sm:self-auto shadow-sm"
          title="Refresh metrics"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Row 1: Threats Over Time & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threats Over Time */}
        <div className="bg-surface-card/85 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Threat Velocity Over Time (7-Day Incident Trend)
              </h3>
              <p className="text-xs text-slate-400">Phishing vs Credential Theft vs Social Engineering</p>
            </div>
            <span className="text-[10px] font-mono font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/25">
              SIEM STREAM
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.threats_over_time}>
                <defs>
                  <linearGradient id="phishGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="credGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="phishing"
                  name="Phishing"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#phishGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="credential_theft"
                  name="Cred Theft"
                  stroke="#f97316"
                  fillOpacity={1}
                  fill="url(#credGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Threat Severity Breakdown
            </h3>
            <p className="text-xs text-slate-400">Classified by Solwin Risk Engine</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.risk_distribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {data.risk_distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={RISK_COLORS[entry.name] || '#ef4444'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => <span className="text-xs text-slate-300 font-mono">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Threat Types & Social Engineering Tactics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Types Bar Chart */}
        <div className="bg-surface-card/85 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="pb-2 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white tracking-tight font-sans">
              Top Threat Vectors
            </h3>
            <p className="text-xs text-slate-400">Total detected incidents grouped by adversary category</p>
          </div>

          <div className="h-60 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.threat_types} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Incidents" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Social Engineering Tactics */}
        <div className="bg-surface-card/85 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="pb-2 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white tracking-tight font-sans">
              Social Engineering Manipulation Techniques
            </h3>
            <p className="text-xs text-slate-400">Natural language deception patterns parsed by NLP</p>
          </div>

          <div className="h-60 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.social_engineering_techniques} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  dataKey="technique"
                  type="category"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  width={130}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Observed" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Suspicious Domains List */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-rose-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Suspicious Domain Infrastructure Watchlist
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Automated DNS & Whois Enrichment</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-mono text-[11px] uppercase">
                <th className="py-2 px-3">Suspicious Domain</th>
                <th className="py-2 px-3">Detection Count</th>
                <th className="py-2 px-3">Risk Assessment</th>
                <th className="py-2 px-3">Recommended Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {data.suspicious_domains.map((dom, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 text-rose-300 font-semibold">{dom.domain}</td>
                  <td className="py-2.5 px-3 text-slate-300">{dom.detections} inquiries</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-rose-950/60 text-rose-400 border border-rose-900/40">
                      {dom.risk_level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans">
                    Block domain at DNS firewall and quarantine incoming mail matching domain.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
