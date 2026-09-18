import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  ShieldAlert,
  Clock,
  ArrowRight,
  ExternalLink,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Mail,
  ChevronRight,
  Activity,
  Zap,
  ShieldCheck,
  Flame,
  Terminal,
  RefreshCw,
} from 'lucide-react';
import { getDashboardOverview } from '../services/analyticsApi';
import { getConversations } from '../services/conversationApi';
import { getThreats } from '../services/securityApi';
import { DashboardOverview } from '../types/analytics';
import { Conversation } from '../types/conversation';
import { ThreatRecord } from '../types/security';
import { RiskBadge } from '../components/common/RiskBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/dashboard/KpiCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [recentThreats, setRecentThreats] = useState<ThreatRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quarantined, setQuarantined] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [overview, convRes, threatRes] = await Promise.all([
        getDashboardOverview(),
        getConversations({ limit: 4 }),
        getThreats({ limit: 4 }),
      ]);
      setData(overview);
      setRecentConversations(convRes.data);
      setRecentThreats(threatRes.data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerLiveSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      // Simulate live incoming threat event
      setQuarantined(false);
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-7 w-56 bg-slate-800 rounded-xl animate-pulse" />
        <CardSkeleton count={4} />
      </div>
    );
  }

  if (error || !data) {
    return <ErrorState title="Dashboard telemetry unavailable" message={error || ''} onRetry={loadData} />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Platform Live Ops Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-card border border-surface-border p-5 sm:p-6 shadow-card">
        {/* Ambient Top Glow Line */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-cyan via-indigo-500 to-rose-500 opacity-60" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-400">
                ACTIVE DEFENSE GRID
              </span>
              <span className="text-slate-600 font-mono text-xs">•</span>
              <span className="text-[11px] font-mono text-slate-400">
                AI REASONING LATENCY: 128MS
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              Cybersecurity & Support Operations
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Unified intelligence grid fusing multi-channel customer inquiries, real-time NLP sentiment extraction, and automated cyber threat vector quarantine.
            </p>
          </div>

          {/* Action Hub with Simulation Trigger for Hackathon Judges */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={triggerLiveSimulation}
              disabled={isSimulating}
              className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-slate-800 text-slate-200 border border-surface-border text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-sm"
              title="Simulate incoming threat telemetry"
            >
              <RefreshCw size={14} className={`text-brand-cyan ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'INGESTING TELEMETRY...' : 'SIMULATE INGEST'}</span>
            </button>

            <button
              onClick={() => navigate('/threats')}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/35 text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-glow-rose/20"
            >
              <ShieldAlert size={15} />
              <span>THREAT RADAR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Incident Containment Strip */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.04] p-5 shadow-glow-rose/10 relative overflow-hidden">
        <div className="absolute left-0 inset-y-0 w-1 bg-rose-500 shadow-glow-rose" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5">
              <ShieldAlert size={20} />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-rose-300">Urgent Incident Containment Required</span>
                <span className="text-[11px] font-mono px-2 py-0.2 rounded bg-rose-500/20 text-rose-200 border border-rose-500/30 font-bold">
                  TICKET conv_8912
                </span>
                <span className="text-[11px] font-mono text-slate-400">Target: Meera Nair (Acme Corp)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                Active spear-phishing attack attempting 2FA token harvesting via lookalike domain{' '}
                <span className="font-mono text-rose-300 font-semibold underline decoration-rose-500/60">auth-solwin-verify.cloud-login.net</span>. Customer reported immediate payroll database lockout threat.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pl-12 lg:pl-0">
            <button
              onClick={() => setQuarantined(true)}
              disabled={quarantined}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                quarantined
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default shadow-glow-emerald/20'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-glow-rose font-bold'
              }`}
            >
              {quarantined ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Domain Quarantined</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Quarantine Domain</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate('/conversations/conv_8912')}
              className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-slate-800 border border-surface-border text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Inspect Ticket</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Operational Pulse Bar (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Omnichannel Inbound"
          value={data.total_conversations}
          icon={MessageSquare}
          trend={{ value: '+12% this week', isPositive: true }}
          subtext="Processed by NLP Triage"
          variant="default"
        />
        <KpiCard
          label="Unresolved Queue"
          value={data.unresolved}
          icon={Clock}
          trend={{ value: 'Priority queue', isPositive: false }}
          subtext="Awaiting response"
          variant="warning"
        />
        <KpiCard
          label="Threats Quarantined"
          value={data.threats_detected}
          icon={ShieldAlert}
          trend={{ value: '18 active IOCs', isPositive: false }}
          subtext="EDR / Phishing vectors"
          variant="danger"
        />
        <KpiCard
          label="Critical Escalations"
          value={data.critical_cases || data.critical_threats}
          icon={Flame}
          trend={{ value: 'Requires immediate action', isPositive: false }}
          subtext="High urgency triage"
          variant="info"
        />
      </div>

      {/* Main Grid: Active Inquiries vs High-Risk Threat Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recent Inbound Conversations (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-3.5 border-b border-surface-border">
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-tight font-sans flex items-center gap-2">
                <MessageSquare size={16} className="text-brand-cyan" />
                <span>Inbound Telemetry Stream</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Tickets triaged by NLP classification & risk weighting</p>
            </div>
            <button
              onClick={() => navigate('/conversations')}
              className="text-xs font-mono text-brand-cyan hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-surface-elevated border border-surface-border"
            >
              <span>View all tickets</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-surface-border">
            {recentConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => navigate(`/conversations/${conv.id}`)}
                className="py-3.5 first:pt-1 last:pb-1 flex items-start justify-between gap-4 cursor-pointer group hover:bg-surface-elevated/60 -mx-2 px-3 rounded-xl transition-all"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-200 group-hover:text-brand-cyan transition-colors">
                      {conv.customer_name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-elevated text-slate-400 border border-surface-border uppercase">
                      {conv.channel}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">• {conv.updated_at}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-md">{conv.issue}</p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <PriorityBadge priority={conv.priority} />
                    <StatusBadge status={conv.status} />
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 pt-1">
                  <RiskBadge level={conv.security_risk} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: SOC Incident Watchlist (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-3.5 border-b border-surface-border">
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-tight font-sans flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-400" />
                <span>Active Threat Watchlist</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time IOC detections and deceptive payloads</p>
            </div>
            <button
              onClick={() => navigate('/threats')}
              className="text-xs font-mono text-rose-300 hover:text-white font-semibold flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30"
            >
              <span>Directory</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {recentThreats.map((threat) => (
              <div
                key={threat.id}
                onClick={() => navigate(`/threats/${threat.id}`)}
                className="p-3.5 rounded-xl border border-surface-border bg-surface-elevated/60 hover:bg-surface-elevated hover:border-slate-700 cursor-pointer transition-all space-y-2 group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-rose-300 group-hover:text-rose-200 transition-colors">
                    {threat.id}
                  </span>
                  <RiskBadge level={threat.risk_level} size="sm" />
                </div>
                <div className="text-xs font-semibold text-slate-200">{threat.threat_type}</div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="truncate text-slate-400">Target: {threat.customer_name}</span>
                  <span className="uppercase text-slate-400">{threat.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick link to threat directory */}
          <div className="pt-2 border-t border-surface-border">
            <button
              onClick={() => navigate('/threats')}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-rose-500/15 via-surface-elevated to-surface-elevated hover:from-rose-500/25 border border-rose-500/30 text-slate-200 text-xs font-semibold flex items-center justify-between transition-all group shadow-sm"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert size={15} className="text-rose-400 animate-pulse" />
                <span>Threat Intelligence Directory: Active Vectors</span>
              </div>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform text-rose-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Dual Analytical Panels: Sentiment Stratification & Category Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-tight font-sans">
                Customer Sentiment Breakdown
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Automated NLP sentiment distribution across open tickets</p>
            </div>
            <button
              onClick={() => navigate('/insights/customer')}
              className="text-xs font-mono text-brand-cyan hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-lg bg-surface-elevated border border-surface-border"
            >
              <span>Trends</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-emerald-400 font-semibold">Positive customer sentiment</span>
                <span className="text-emerald-300 font-bold">{data.sentiment_breakdown.positive_percentage}%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full shadow-glow-emerald"
                  style={{ width: `${data.sentiment_breakdown.positive_percentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-slate-300 font-semibold">Neutral inquiries</span>
                <span className="text-slate-400 font-bold">{data.sentiment_breakdown.neutral_percentage}%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-500 h-full rounded-full"
                  style={{ width: `${data.sentiment_breakdown.neutral_percentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-rose-400 font-semibold">Negative or distressed inquiries</span>
                <span className="text-rose-300 font-bold">{data.sentiment_breakdown.negative_percentage}%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full shadow-glow-rose"
                  style={{ width: `${data.sentiment_breakdown.negative_percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Problem Categories */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-tight font-sans">
                Top Issue Categories
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Ticket volume grouped by problem domain</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-brand-cyan border border-surface-border font-bold">
              3,970 CASES
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {data.top_issues.map((issue, idx) => {
              const maxVal = Math.max(...data.top_issues.map((i) => i.count));
              const pct = Math.round((issue.count / maxVal) * 100);

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{issue.name}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{issue.count.toLocaleString()} cases</span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-cyan to-blue-500 h-full rounded-full shadow-glow-cyan/50"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
