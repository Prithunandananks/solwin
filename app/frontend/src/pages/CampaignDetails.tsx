import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCampaign } from '../services/campaignApi';
import { ThreatCampaign } from '../types/campaign';
import { RiskBadge } from '../components/common/RiskBadge';
import { ErrorState } from '../components/common/ErrorState';
import {
  ChevronLeft,
  Radio,
  Globe,
  Mail,
  ShieldAlert,
  Clock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export const CampaignDetails: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<ThreatCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaign = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCampaign(id);
      setCampaign(data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve campaign data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaign();
  }, [id]);

  if (error || (!isLoading && !campaign)) {
    return (
      <ErrorState
        title="Campaign Not Found"
        message={error || `Could not find campaign ${id}`}
        onRetry={loadCampaign}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/campaigns')}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-indigo-400">{campaign?.id}</span>
              {campaign && <RiskBadge level={campaign.risk_level} />}
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {campaign?.status}
              </span>
            </div>
            <h1 className="text-base font-semibold text-white mt-0.5">{campaign?.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>First: {campaign?.first_detected}</span>
          <span>•</span>
          <span>Last: {campaign?.last_detected}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Affected Tickets</span>
          <span className="font-mono text-2xl font-bold text-white">
            {campaign?.affected_conversations_count}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Shared Domains</span>
          <span className="font-mono text-2xl font-bold text-purple-400">
            {campaign?.suspicious_domains_count}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Sender Patterns</span>
          <span className="font-mono text-2xl font-bold text-amber-400">
            {campaign?.sender_patterns_count}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Observed Tactics</span>
          <span className="font-mono text-2xl font-bold text-rose-400">
            {campaign?.techniques_count}
          </span>
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common Domains & URLs */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-brand-blue">
            <Globe size={16} />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Shared Adversary Infrastructure
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Common Domains</span>
              <div className="flex flex-wrap gap-2">
                {campaign?.common_domains.map((dom, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-slate-950 text-rose-300 border border-slate-800 font-mono text-xs"
                  >
                    {dom}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Full Attack URLs</span>
              <div className="space-y-1.5">
                {campaign?.common_urls.map((url, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-brand-cyan truncate"
                  >
                    {url}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Common Senders & Techniques */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Mail size={16} />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Sender Signatures & TTPs
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Spoofed Senders</span>
              <div className="space-y-1.5">
                {campaign?.common_senders.map((snd, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 truncate"
                  >
                    {snd}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Adversary Tactics (MITRE ATT&CK)</span>
              <div className="flex flex-wrap gap-1.5">
                {campaign?.common_techniques.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-amber-950/30 text-amber-300 border border-amber-800/40 text-xs font-medium"
                  >
                    • {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Detection Timeline */}
      {campaign?.timeline_events && campaign.timeline_events.length > 0 && (
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock size={16} />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Correlation Timeline Progression
            </h3>
          </div>

          <div className="space-y-2.5 pt-2">
            {campaign.timeline_events.map((evt, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs"
              >
                <span className="font-mono text-slate-400 shrink-0">{evt.date}</span>
                <span className="text-slate-200 flex-1">{evt.event}</span>
                {evt.severity && (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {evt.severity}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Conversations Links */}
      {campaign?.related_conversation_ids && campaign.related_conversation_ids.length > 0 && (
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Linked Incident Tickets ({campaign.related_conversation_ids.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {campaign.related_conversation_ids.map((convId) => (
              <button
                key={convId}
                onClick={() => navigate(`/conversations/${convId}`)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
              >
                <MessageSquare size={13} className="text-brand-blue" />
                <span>Ticket {convId}</span>
                <ExternalLink size={11} className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
