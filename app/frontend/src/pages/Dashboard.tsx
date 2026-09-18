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
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-700">
                LIVE SOC MONITOR ACTIVE
              </span>
              <span className="text-slate-300 font-mono text-xs">•</span>
              <span className="text-[11px] font-mono text-slate-500">
                DEFCON NORMAL (GUARDED)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Cybersecurity & Support Operations
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Unified intelligence grid fusing multi-channel customer inquiries, real-time NLP sentiment extraction, and automated cyber threat vector quarantine.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/threats')}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-sm"
            >
              <ShieldAlert size={15} />
              <span>THREAT RADAR</span>
            </button>
            <button
              onClick={() => navigate('/campaigns')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-sm"
            >
              <Radio size={15} />
              <span>CAMPAIGNS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Incident Containment Strip */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700 border border-rose-200 shrink-0 mt-0.5">
              <ShieldAlert size={20} />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-rose-900">Urgent incident containment required</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200">
                  Ticket conv_8912
                </span>
                <span className="text-[11px] font-mono text-slate-600">Target: Meera Nair</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                Active spear-phishing attack attempting 2FA token harvesting via deceptive domain{' '}
                <span className="font-mono text-rose-800 font-semibold underline decoration-rose-400">cloud-login.net</span>. Customer reported immediate lockout threat.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pl-12 lg:pl-0">
            <button
              onClick={() => setQuarantined(true)}
              disabled={quarantined}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                quarantined
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
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
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Investigate ticket</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Operational Pulse Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Conversations</span>
            <MessageSquare size={15} className="text-slate-400" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 tracking-tight">
            {data.total_conversations.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">+12% this week</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Unresolved queue</span>
            <Clock size={15} className="text-amber-500" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 tracking-tight">
            {data.unresolved}
          </div>
          <p className="text-[11px] text-slate-500">24 critical cases</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-rose-200 bg-rose-50/30 space-y-1 shadow-card">
          <div className="flex items-center justify-between text-xs text-rose-700">
            <span>Threats detected</span>
            <ShieldAlert size={15} className="text-rose-600" />
          </div>
          <div className="text-2xl font-semibold text-rose-800 tracking-tight">
            {data.threats_detected}
          </div>
          <p className="text-[11px] text-rose-700 font-medium">18 require mitigation</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Correlated campaigns</span>
            <Radio size={15} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 tracking-tight">
            {data.active_campaigns}
          </div>
          <p className="text-[11px] text-slate-500">Multi-ticket waves</p>
        </div>
      </div>

      {/* Main Grid: Active Inquiries vs High-Risk Threat Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recent Inbound Conversations (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
                <MessageSquare size={16} className="text-slate-900" />
                <span>Inbound Telemetry Stream</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Tickets triaged by NLP classification & risk weighting</p>
            </div>
            <button
              onClick={() => navigate('/conversations')}
              className="text-xs font-mono text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200"
            >
              <span>View all tickets</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => navigate(`/conversations/${conv.id}`)}
                className="py-3.5 first:pt-1 last:pb-1 flex items-start justify-between gap-4 cursor-pointer group hover:bg-slate-50 -mx-2 px-3 rounded-xl transition-all"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-slate-700 transition-colors">
                      {conv.customer_name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                      {conv.channel}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">• {conv.updated_at}</span>
                  </div>
                  <p className="text-xs text-slate-600 truncate max-w-md">{conv.issue}</p>
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
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight font-sans flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-600" />
                <span>Active Threat Watchlist</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time IOC detections and deceptive payloads</p>
            </div>
            <button
              onClick={() => navigate('/threats')}
              className="text-xs font-mono text-rose-700 hover:text-rose-900 font-semibold flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200"
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
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 cursor-pointer transition-all space-y-2 group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-rose-700 group-hover:text-rose-900 transition-colors">
                    {threat.id}
                  </span>
                  <RiskBadge level={threat.risk_level} size="sm" />
                </div>
                <div className="text-xs font-semibold text-slate-900">{threat.threat_type}</div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="truncate">Target: {threat.customer_name}</span>
                  <span className="uppercase text-slate-500">{threat.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick link to campaign radar */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => navigate('/campaigns')}
              className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-between transition-all group shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Radio size={15} className="text-indigo-600 animate-pulse" />
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
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight font-sans">
                Customer Sentiment Breakdown
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Automated NLP sentiment distribution across open tickets</p>
            </div>
            <button
              onClick={() => navigate('/insights/customer')}
              className="text-xs font-mono text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-lg bg-slate-100 border border-slate-200"
            >
              <span>Trends</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-emerald-700 font-semibold">Positive customer sentiment</span>
                <span className="text-emerald-800 font-bold">{data.sentiment_breakdown.positive_percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${data.sentiment_breakdown.positive_percentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-slate-700 font-semibold">Neutral inquiries</span>
                <span className="text-slate-600 font-bold">{data.sentiment_breakdown.neutral_percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-400 h-full rounded-full"
                  style={{ width: `${data.sentiment_breakdown.neutral_percentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-rose-700 font-semibold">Negative or distressed inquiries</span>
                <span className="text-rose-800 font-bold">{data.sentiment_breakdown.negative_percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-600 h-full rounded-full"
                  style={{ width: `${data.sentiment_breakdown.negative_percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Problem Categories */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight font-sans">
                Top Issue Categories
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Ticket volume grouped by problem domain</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-bold">
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
                    <span className="text-slate-800 font-medium">{issue.name}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{issue.count.toLocaleString()} cases</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-full"
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
