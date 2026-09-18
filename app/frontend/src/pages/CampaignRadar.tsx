import React, { useState, useEffect } from 'react';
import { getCampaigns } from '../services/campaignApi';
import { ThreatCampaign } from '../types/campaign';
import { CampaignCard } from '../components/campaigns/CampaignCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { Radio, Network, RefreshCw, Layers, ShieldAlert, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CampaignRadar: React.FC = () => {
  const [campaigns, setCampaigns] = useState<ThreatCampaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
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
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Page Header with Radar Status */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-indigo-400">
              CORRELATION ENGINE ACTIVE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
            <span>Threat Campaign Radar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Automated cluster graph identifying shared infrastructure, typo-squatted domains, and coordinated adversary TTPs.
          </p>
        </div>

        <button
          onClick={loadCampaigns}
          className="p-2.5 rounded-xl border border-white/10 bg-surface-card hover:bg-surface-elevated text-slate-400 hover:text-white transition-all self-start sm:self-auto shadow-sm"
          title="Re-run correlation engine"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Interactive Infrastructure Cluster Graph */}
      {activeCampaign && (
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card/85 backdrop-blur-md p-5 sm:p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                <Network size={16} />
              </div>
              <span className="text-sm font-bold text-white font-sans">
                Coordinated Attack Cluster: <span className="text-indigo-300 font-mono">{activeCampaign.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Clusters:</span>
              <div className="flex gap-1.5">
                {campaigns.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCampaignId(c.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      c.id === activeCampaign.id
                        ? 'bg-gradient-to-r from-brand-indigo to-brand-blue text-white shadow-glow-sm'
                        : 'bg-surface-elevated text-slate-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {c.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Structured Attack Topography Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Column 1: Ingress Attack Vectors */}
            <div className="p-4 rounded-xl bg-surface-elevated/40 border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/[0.06] pb-2 font-mono">
                <span className="font-semibold text-slate-300">1. Ingress Vectors</span>
                <span className="text-[11px] text-rose-400 font-bold px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/20">{activeCampaign.affected_conversations_count} targets</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adversary dispatched multi-channel lures requesting urgent credentials under false database deletion pretenses.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Targeted senders:</span>
                {activeCampaign.common_senders.map((s, i) => (
                  <div key={i} className="text-xs font-mono text-slate-300 bg-[#070a14]/80 p-2 rounded-lg mb-1.5 border border-white/[0.06] truncate">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Shared Adversary Infrastructure */}
            <div className="p-4 rounded-xl bg-surface-elevated/40 border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/[0.06] pb-2 font-mono">
                <span className="font-semibold text-slate-300">2. Shared Infrastructure</span>
                <span className="text-[11px] text-amber-400 font-bold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">{activeCampaign.suspicious_domains_count} domains</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reverse-proxy landing pages cloned from enterprise login portals hosted on rogue ASN infrastructure.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Correlated lookalike domains:</span>
                {activeCampaign.common_domains.map((d, i) => (
                  <div key={i} className="text-xs font-mono text-rose-300 bg-rose-500/[0.08] p-2 rounded-lg mb-1.5 border border-rose-500/25 truncate font-semibold">
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: MITRE ATT&CK Techniques */}
            <div className="p-4 rounded-lg bg-slate-950/60 border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-2">
                <span className="font-medium">3. Observed Techniques</span>
                <span className="font-mono text-[11px] text-sky-400">{activeCampaign.techniques_count} tactics</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {activeCampaign.common_techniques.map((tech, i) => (
                  <div key={i} className="text-xs text-slate-300 bg-slate-900/80 p-1.5 rounded border border-white/5">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Correlated from tickets conv_8912, conv_8913, conv_8914
            </span>
            <button
              onClick={() => navigate(`/campaigns/${activeCampaign.id}`)}
              className="text-xs font-medium text-brand-cyan hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              <span>Inspect full campaign timeline</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Campaign Cards List */}
      <div className="space-y-4">
        <h2 className="text-xs font-medium text-slate-400">
          All active campaign clusters ({campaigns.length})
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
