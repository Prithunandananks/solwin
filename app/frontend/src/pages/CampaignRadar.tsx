import React, { useState, useEffect } from 'react';
import { getCampaigns } from '../services/campaignApi';
import { ThreatCampaign } from '../types/campaign';
import { CampaignCard } from '../components/campaigns/CampaignCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  Radio,
  Network,
  RefreshCw,
  Layers,
  ShieldAlert,
  Globe,
  ArrowRight,
  Server,
  Users,
  Target,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CampaignRadar: React.FC = () => {
  const [campaigns, setCampaigns] = useState<ThreatCampaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [activeNode, setActiveNode] = useState<{ type: string; label: string; detail: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadCampaigns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCampaigns();
      setCampaigns(data);
      if (data.length > 0 && !selectedCampaignId) {
        setSelectedCampaignId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to detect coordinated campaigns.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />
        <CardSkeleton count={2} />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Campaign radar unavailable" message={error} onRetry={loadCampaigns} />;
  }

  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-12">
      {/* Page Header with Radar Status */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-indigo-400">
              GRAPH CORRELATION ENGINE ACTIVE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
            <span>Threat Campaign Radar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Automated cluster graph identifying shared adversary infrastructure, typo-squatted domains, and coordinated phishing TTPs across multi-customer support tickets.
          </p>
        </div>

        <button
          onClick={loadCampaigns}
          className="p-2.5 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-elevated text-slate-400 hover:text-slate-100 transition-all self-start sm:self-auto shadow-sm"
          title="Re-run correlation engine"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Interactive Infrastructure Cluster Graph */}
      {activeCampaign && (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-6 shadow-card relative overflow-hidden">
          {/* Top subtle glow banner */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-brand-cyan to-rose-500 opacity-60" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 shadow-glow-indigo/20">
                <Network size={18} />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-100 font-sans block">
                  Cluster Graph: <span className="text-indigo-300 font-mono">{activeCampaign.name}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">Click any node to inspect telemetry evidence</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Active Clusters:</span>
              <div className="flex gap-1.5">
                {campaigns.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCampaignId(c.id);
                      setActiveNode(null);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all shadow-sm ${
                      c.id === activeCampaign.id
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-glow-indigo/30'
                        : 'bg-surface-elevated text-slate-400 hover:text-white border border-surface-border'
                    }`}
                  >
                    {c.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Visual SVG Topography Map */}
          <div className="relative rounded-2xl bg-surface-elevated/80 border border-surface-border p-6 overflow-hidden min-h-[280px] flex flex-col justify-between">
            {/* Background Radar Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-96 h-96 rounded-full border border-dashed border-indigo-500/40 animate-pulse-slow" />
              <div className="absolute w-64 h-64 rounded-full border border-indigo-500/30" />
              <div className="absolute w-36 h-36 rounded-full border border-indigo-500/20" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Node 1: Adversary Origin */}
              <div
                onClick={() =>
                  setActiveNode({
                    type: 'Adversary Signature',
                    label: 'Threat Group UNC-842',
                    detail: `Observed dispatching automated credential harvesting lures targeting ${activeCampaign.affected_conversations_count} enterprise accounts.`,
                  })
                }
                className="cursor-pointer p-4 rounded-xl bg-surface-card border border-rose-500/30 hover:border-rose-500 hover:shadow-glow-rose/30 transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <Target size={18} />
                </div>
                <div className="font-mono text-xs font-bold text-rose-300">Origin Threat Actor</div>
                <div className="text-[11px] font-mono text-slate-400">UNC-842 Cluster</div>
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  {activeCampaign.risk_level} SEVERITY
                </span>
              </div>

              {/* Node 2: Attack Senders */}
              <div
                onClick={() =>
                  setActiveNode({
                    type: 'Spoofed Senders',
                    label: activeCampaign.common_senders[0] || 'Spoofed Senders',
                    detail: `Coordinated sender list: ${activeCampaign.common_senders.join(', ')}`,
                  })
                }
                className="cursor-pointer p-4 rounded-xl bg-surface-card border border-amber-500/30 hover:border-amber-500 hover:shadow-glow-amber transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Users size={18} />
                </div>
                <div className="font-mono text-xs font-bold text-amber-300">Ingress Vectors</div>
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  {activeCampaign.common_senders[0] || 'Spoofed Ingress'}
                </div>
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {activeCampaign.sender_patterns_count} SENDER PATTERNS
                </span>
              </div>

              {/* Node 3: Shared Infrastructure */}
              <div
                onClick={() =>
                  setActiveNode({
                    type: 'Rogue Infrastructure',
                    label: activeCampaign.common_domains[0] || 'Adversary Domains',
                    detail: `Lookalike domains hosted on shared rogue autonomous system: ${activeCampaign.common_domains.join(', ')}`,
                  })
                }
                className="cursor-pointer p-4 rounded-xl bg-surface-card border border-brand-cyan/30 hover:border-brand-cyan hover:shadow-glow-cyan/30 transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
                  <Server size={18} />
                </div>
                <div className="font-mono text-xs font-bold text-cyan-300">Shared Infrastructure</div>
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  {activeCampaign.common_domains[0] || 'Adversary Domains'}
                </div>
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {activeCampaign.suspicious_domains_count} CORRELATED HOSTS
                </span>
              </div>

              {/* Node 4: Targeted Customers */}
              <div
                onClick={() =>
                  setActiveNode({
                    type: 'Impacted Accounts',
                    label: `${activeCampaign.affected_conversations_count} Enterprise Targets`,
                    detail: `Adversary lured accounts into submitting OTP and 2FA authentication tokens.`,
                  })
                }
                className="cursor-pointer p-4 rounded-xl bg-surface-card border border-indigo-500/30 hover:border-indigo-500 hover:shadow-glow-indigo/30 transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform">
                  <Layers size={18} />
                </div>
                <div className="font-mono text-xs font-bold text-indigo-300">Impacted Support Tickets</div>
                <div className="text-[11px] font-mono text-slate-400">
                  {activeCampaign.affected_conversations_count} Customer Accounts
                </div>
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  INTERCEPTED
                </span>
              </div>
            </div>

            {/* Live Interactive Node Inspector Pill */}
            {activeNode && (
              <div className="mt-4 p-3.5 rounded-xl bg-surface-card border border-brand-cyan/40 shadow-glow-cyan/20 animate-in fade-in flex items-start justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono uppercase text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                      {activeNode.type}
                    </span>
                    <span className="font-bold text-slate-100">{activeNode.label}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{activeNode.detail}</p>
                </div>
                <button
                  onClick={() => setActiveNode(null)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Structured Attack Topography Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Column 1: Ingress Attack Vectors */}
            <div className="p-4 rounded-xl bg-surface-elevated/60 border border-surface-border space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-surface-border pb-2 font-mono">
                <span className="font-semibold text-slate-200">1. Ingress Vectors</span>
                <span className="text-[11px] text-rose-400 font-bold px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/30">
                  {activeCampaign.affected_conversations_count} targets
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adversary dispatched multi-channel lures requesting urgent credentials under false database deletion pretenses.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-500 block mb-1.5">Targeted senders:</span>
                {activeCampaign.common_senders.map((s, i) => (
                  <div key={i} className="text-xs font-mono text-slate-300 bg-surface-card p-2 rounded-lg mb-1.5 border border-surface-border truncate">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Shared Adversary Infrastructure */}
            <div className="p-4 rounded-xl bg-surface-elevated/60 border border-surface-border space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-surface-border pb-2 font-mono">
                <span className="font-semibold text-slate-200">2. Shared Infrastructure</span>
                <span className="text-[11px] text-amber-400 font-bold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">
                  {activeCampaign.suspicious_domains_count} domains
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reverse-proxy landing pages cloned from enterprise login portals hosted on rogue ASN infrastructure.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-500 block mb-1.5">Correlated lookalike domains:</span>
                {activeCampaign.common_domains.map((d, i) => (
                  <div key={i} className="text-xs font-mono text-rose-300 bg-rose-500/10 p-2 rounded-lg mb-1.5 border border-rose-500/25 truncate font-semibold">
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: MITRE ATT&CK Techniques */}
            <div className="p-4 rounded-xl bg-surface-elevated/60 border border-surface-border space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-surface-border pb-2 font-mono">
                <span className="font-semibold text-slate-200">3. Observed Techniques</span>
                <span className="font-mono text-[11px] text-slate-300 font-semibold">{activeCampaign.techniques_count} tactics</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standardized adversarial procedures observed across message bodies and metadata headers.
              </p>
              <div className="space-y-1.5 pt-1">
                {activeCampaign.common_techniques.map((tech, i) => (
                  <div key={i} className="text-xs text-slate-200 bg-surface-card p-2 rounded-lg border border-surface-border font-mono">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-mono">
              Correlated from tickets conv_8912, conv_8913, conv_8914
            </span>
            <button
              onClick={() => navigate(`/campaigns/${activeCampaign.id}`)}
              className="text-xs font-semibold text-brand-cyan hover:text-cyan-300 flex items-center gap-1.5 transition-colors font-mono"
            >
              <span>Inspect full campaign timeline</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Campaign Cards List */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          All Active Coordinated Clusters ({campaigns.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {campaigns.map((camp) => (
            <CampaignCard key={camp.id} campaign={camp} />
          ))}
        </div>
      </div>
    </div>
  );
};
