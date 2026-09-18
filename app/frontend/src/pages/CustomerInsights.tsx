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
    return <ErrorState title="Insights Unavailable" message={error || ''} onRetry={loadData} />;
  }

  const PRIORITY_COLORS: Record<string, string> = {
    Low: '#94a3b8',
    Medium: '#f59e0b',
    High: '#f97316',
    Critical: '#ef4444',
  };

  const RESOLUTION_COLORS: Record<string, string> = {
    Resolved: '#10b981',
    Pending: '#f59e0b',
    Escalated: '#8b5cf6',
    Unresolved: '#ef4444',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
            </span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-brand-cyan">
              NLP SENTIMENT TELEMETRY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
            <Users size={22} className="text-brand-blue" />
            <span>Customer Support Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time sentiment velocity, multi-channel problem cluster distribution, and AI triage efficacy metrics.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 rounded-xl border border-white/10 bg-surface-card hover:bg-surface-elevated text-slate-400 hover:text-white transition-all self-start sm:self-auto shadow-sm"
          title="Refresh analytics"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Row 1: Sentiment Trends & Top Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trends Chart */}
        <div className="bg-surface-card/85 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Customer Sentiment Velocity (7-Day)
              </h3>
              <p className="text-xs text-slate-400">Classified by Solwin Sentiment NLP Model</p>
            </div>
            <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
              ACTIVE TRIAGE
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.sentiment_trends}>
                <defs>
                  <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
                  dataKey="positive"
                  name="Positive %"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorPositive)"
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  name="Negative %"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorNegative)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Problem Categories */}
        <div className="bg-surface-card/85 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight font-sans">
                Top Customer Problem Categories
              </h3>
              <p className="text-xs text-slate-400">Total volume and share of customer inquiries</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.top_issues} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  dataKey="category"
                  type="category"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Cases" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Priority & Resolution Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-surface-card/85 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="pb-2 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white tracking-tight font-sans">
              Ticket Priority Stratification
            </h3>
            <p className="text-xs text-slate-400">Critical, High, Medium, Low urgency distribution</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.priority_distribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {data.priority_distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PRIORITY_COLORS[entry.name] || '#6366f1'}
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

        {/* Resolution Distribution */}
        <div className="bg-surface-card/85 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="pb-2 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white tracking-tight font-sans">
              Resolution Pipeline Status
            </h3>
            <p className="text-xs text-slate-400">Resolved vs Pending vs Escalated vs Unresolved</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.resolution_distribution}>
                <XAxis dataKey="status" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Tickets" radius={[4, 4, 0, 0]}>
                  {data.resolution_distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={RESOLUTION_COLORS[entry.status] || '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
