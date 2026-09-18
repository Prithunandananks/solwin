import React, { useState, useEffect } from 'react';
import { getCustomerAnalytics } from '../services/analyticsApi';
import { CustomerAnalytics } from '../types/analytics';
import { ChartSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { Users, TrendingUp, HelpCircle, CheckCircle2, RefreshCw } from 'lucide-react';
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

export const CustomerInsights: React.FC = () => {
  const [data, setData] = useState<CustomerAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getCustomerAnalytics();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customer insights.');
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
    return <ErrorState title="Insights Unavailable" message={error || ''} onRetry={loadData} />;
  }

  const PRIORITY_COLORS: Record<string, string> = {
    Low: '#64748b',
    Medium: '#f59e0b',
    High: '#f97316',
    Critical: '#f43f5e',
  };

  const RESOLUTION_COLORS: Record<string, string> = {
    Resolved: '#10b981',
    Pending: '#f59e0b',
    Escalated: '#8b5cf6',
    Unresolved: '#f43f5e',
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-brand-cyan">
              NLP SENTIMENT TELEMETRY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
            <Users size={22} className="text-brand-cyan" />
            <span>Customer Support Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time sentiment velocity, multi-channel problem cluster distribution, and AI triage efficacy metrics.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-elevated text-slate-400 hover:text-slate-100 transition-all self-start sm:self-auto shadow-sm"
          title="Refresh analytics"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Row 1: Sentiment Trends & Top Problem Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trends Over Time */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Sentiment Velocity (7-Day Trend)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Positive vs Neutral vs Distressed ticket volume</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              NLP CONFIDENCE 94%
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.sentiment_trends}>
                <defs>
                  <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomDarkTooltip />} />
                <Area
                  type="monotone"
                  dataKey="positive"
                  name="Positive"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPos)"
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  name="Distressed / Negative"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorNeg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Problem Categories */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Issue Category Distribution
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Top inquiries classified by NLP Intent Engine</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Total Volume</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.top_issues} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis dataKey="category" type="category" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} width={130} />
                <Tooltip content={<CustomDarkTooltip />} />
                <Bar dataKey="count" fill="#06b6d4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Priority Distribution & Workflow Resolution Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Stratification */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Triage Priority Stratification
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated urgency weighting distribution</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.priority_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {data.priority_distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PRIORITY_COLORS[entry.name] || '#3b82f6'}
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

        {/* Resolution Status Distribution */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Workflow Resolution Status
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Tickets resolved vs escalated to Tier-2</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.resolution_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {data.resolution_distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={RESOLUTION_COLORS[entry.status] || '#10b981'}
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
    </div>
  );
};
