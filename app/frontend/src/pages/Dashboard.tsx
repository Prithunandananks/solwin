import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  ShieldAlert,
  Radio,
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
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([]);
  const [recentThreats, setRecentThreats] = useState<ThreatRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quarantined, setQuarantined] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [overview, convRes, threatRes] = await Promise.all([
        getDashboardOverview(),
        getConversations({ limit: 4 }),
        getThreats({ limit: 3 }),
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

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-7 w-56 bg-surface-elevated rounded-xl animate-pulse" />
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface-card via-[#0b1222] to-surface-card border border-white/[0.08] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-400">
                LIVE SOC MONITOR ACTIVE
              </span>
              <span className="text-slate-600 font-mono text-xs">•</span>
              <span className="text-[11px] font-mono text-slate-400">
                DEFCON NORMAL (GUARDED)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              Cybersecurity & Support Operations
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Unified intelligence grid fusing multi-channel customer inquiries, real-time NLP sentiment extraction, and automated cyber threat vector quarantine.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/threats')}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-glow-danger"
            >
              <ShieldAlert size={15} />
              <span>THREAT RADAR</span>
            </button>
            <button
              onClick={() => navigate('/campaigns')}
              className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 text-brand-cyan border border-brand-cyan/30 text-xs font-mono font-semibold transition-all flex items-center gap-2"
            >
              <Radio size={15} />
              <span>CAMPAIGNS</span>
            </button>
            <button
              onClick={() => navigate('/conversations')}
              className="px-3.5 py-2 rounded-xl bg-surface-elevated/90 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            >
              All Tickets ({data.total_conversations})
            </button>
          </div>
        </div>
      </div>

      {/* Critical Incident Containment Strip */}
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.04] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5">
              <ShieldAlert size={20} />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-rose-300">Urgent incident containment required</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60">
                  Ticket conv_8912
                </span>
                <span className="text-[11px] font-mono text-slate-400">Target: Meera Nair</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                Active spear-phishing attack attempting 2FA token harvesting via deceptive domain{' '}
                <span className="font-mono text-rose-200 underline decoration-rose-500/50">cloud-login.net</span>. Customer reported immediate lockout threat.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pl-12 lg:pl-0">
            <button
              onClick={() => setQuarantined(true)}
              disabled={quarantined}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                quarantined
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 cursor-default'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
              }`}
            >
              {quarantined ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Domain quarantined</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Quarantine domain</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate('/conversations/conv_8912')}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <span>Investigate ticket</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Operational Pulse Bar (High-density telemetry bar instead of 8 identical boxes) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Conversations</span>
            <MessageSquare size={15} className="text-slate-500" />
          </div>
          <div className="text-2xl font-semibold text-white tracking-tight">
            {data.total_conversations.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">+12% this week</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Unresolved queue</span>
            <Clock size={15} className="text-amber-400/80" />
          </div>
          <div className="text-2xl font-semibold text-white tracking-tight">
            {data.unresolved}
          </div>
          <p className="text-[11px] text-slate-400">24 critical cases</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-rose-500/20 bg-rose-500/[0.02] space-y-1">
          <div className="flex items-center justify-between text-xs text-rose-300">
            <span>Threats detected</span>
            <ShieldAlert size={15} className="text-rose-400" />
          </div>
          <div className="text-2xl font-semibold text-rose-200 tracking-tight">
            {data.threats_detected}
          </div>
          <p className="text-[11px] text-rose-400 font-medium">18 require mitigation</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Correlated campaigns</span>
            <Radio size={15} className="text-sky-400" />
          </div>
          <div className="text-2xl font-semibold text-white tracking-tight">
            {data.active_campaigns}
          </div>
          <p className="text-[11px] text-slate-400">Multi-ticket waves</p>
        </div>
      </div>

      {/* Main Grid: Active Inquiries vs High-Risk Threat Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recent Inbound Conversations (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-surface-card/85 backdrop-blur-md p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
                <MessageSquare size={16} className="text-brand-cyan" />
                <span>Inbound Telemetry Stream</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Tickets triaged by NLP classification & risk weighting</p>
            </div>
            <button
              onClick={() => navigate('/conversations')}
              className="text-xs font-mono text-brand-cyan hover:text-sky-300 font-semibold flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-brand-blue/10 border border-brand-blue/20"
            >
              <span>View all tickets</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-white/[0.05]">
            {recentConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => navigate(`/conversations/${conv.id}`)}
                className="py-3.5 first:pt-1 last:pb-1 flex items-start justify-between gap-4 cursor-pointer group hover:bg-surface-elevated/60 -mx-2 px-3 rounded-xl transition-all"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white group-hover:text-brand-cyan transition-colors">
                      {conv.customer_name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-elevated text-slate-400 border border-white/[0.06] uppercase">
                      {conv.channel}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">• {conv.updated_at}</span>
                  </div>
                  <p className="text-xs text-slate-300 truncate max-w-md">{conv.issue}</p>
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
        <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-surface-card/85 backdrop-blur-md p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight font-sans flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-400" />
                <span>Active Threat Watchlist</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time IOC detections and deceptive payloads</p>
            </div>
            <button
              onClick={() => navigate('/threats')}
              className="text-xs font-mono text-rose-300 hover:text-rose-200 font-semibold flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20"
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
                className="p-3.5 rounded-xl border border-white/[0.07] bg-surface-elevated/40 hover:bg-surface-elevated/80 hover:border-white/15 cursor-pointer transition-all space-y-2 group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-rose-300 group-hover:text-rose-200 transition-colors">
                    {threat.id}
                  </span>
                  <RiskBadge level={threat.risk_level} size="sm" />
                </div>
                <div className="text-xs font-semibold text-slate-100">{threat.threat_type}</div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="truncate">Target: {threat.customer_name}</span>
                  <span className="uppercase text-slate-500">{threat.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick link to campaign radar */}
          <div className="pt-2 border-t border-white/[0.08]">
            <button
              onClick={() => navigate('/campaigns')}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-brand-indigo/15 via-brand-blue/10 to-transparent border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 text-xs font-semibold flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2">
                <Radio size={15} className="text-indigo-400 animate-pulse" />
                <span>Campaign Radar: Coordinated Waves Active</span>
              </div>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Dual Analytical Panels: Sentiment Stratification & Category Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution */}
        <div className="bg-surface-card/85 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight font-sans">
                Customer Sentiment Breakdown
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Automated NLP sentiment distribution across open tickets</p>
            </div>
            <button
              onClick={() => navigate('/insights/customer')}
              className="text-xs font-mono text-brand-cyan hover:text-sky-300 font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-lg bg-brand-blue/10 border border-brand-blue/20"
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
              <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                  style={{ width: `${data.sentiment_breakdown.positive_percentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-slate-300 font-semibold">Neutral inquiries</span>
                <span className="text-slate-400 font-bold">{data.sentiment_breakdown.neutral_percentage}%</span>
              </div>
              <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-400 h-full rounded-full"
                  style={{ width: `${data.sentiment_breakdown.neutral_percentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-rose-400 font-semibold">Negative or distressed inquiries</span>
                <span className="text-rose-300 font-bold">{data.sentiment_breakdown.negative_percentage}%</span>
              </div>
              <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full shadow-glow-danger"
                  style={{ width: `${data.sentiment_breakdown.negative_percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Problem Categories */}
        <div className="bg-surface-card/85 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight font-sans">
                Top Issue Categories
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Ticket volume grouped by problem domain</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-brand-cyan border border-white/[0.08] font-bold">
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
                    <span className="text-slate-200 font-medium">{issue.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{issue.count.toLocaleString()} cases</span>
                  </div>
                  <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-blue to-brand-indigo h-full rounded-full"
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
