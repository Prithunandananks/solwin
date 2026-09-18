import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreatCampaign } from '../../types/campaign';
import { RiskBadge } from '../common/RiskBadge';
import { Radio, Users, Globe, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

interface CampaignCardProps {
  campaign: ThreatCampaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-card/85 backdrop-blur-md border border-white/[0.08] hover:border-brand-blue/40 rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between hover:shadow-lg group">
      <div className="space-y-4">
        {/* Top bar: ID, Risk, Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 group-hover:scale-105 transition-transform">
              <Radio size={16} className="animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-slate-400">{campaign.id}</span>
              <h3 className="text-sm font-bold text-white font-sans leading-tight mt-0.5 group-hover:text-brand-cyan transition-colors">
                {campaign.name}
              </h3>
            </div>
          </div>
          <RiskBadge level={campaign.risk_level} size="sm" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-surface-elevated/40 border border-white/[0.06] text-xs font-mono">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-brand-blue shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Targets</span>
              <span className="font-bold text-white text-xs">{campaign.affected_conversations_count}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Globe size={14} className="text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Domains</span>
              <span className="font-bold text-white text-xs">{campaign.suspicious_domains_count}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Mail size={14} className="text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Senders</span>
              <span className="font-bold text-white text-xs">{campaign.sender_patterns_count}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-rose-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Tactics</span>
              <span className="font-bold text-white text-xs">{campaign.techniques_count}</span>
            </div>
          </div>
        </div>

        {/* Key Indicators */}
        <div className="space-y-2 text-xs">
          <div>
            <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Common Domains:</span>
            <div className="flex flex-wrap gap-1.5">
              {campaign.common_domains.slice(0, 3).map((dom, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/25 font-mono text-[11px] font-medium"
                >
                  {dom}
                </span>
              ))}
              {campaign.common_domains.length > 3 && (
                <span className="text-[11px] font-mono text-slate-500 self-center">
                  +{campaign.common_domains.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 block mb-1">Observed Tactics:</span>
            <p className="text-slate-300 truncate text-xs">
              {campaign.common_techniques.slice(0, 2).join(' • ')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Link */}
      <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
        <div className="text-[11px] font-mono text-slate-500">
          Last detected: {campaign.last_detected}
        </div>
        <button
          onClick={() => navigate(`/campaigns/${campaign.id}`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-cyan hover:text-sky-300 transition-colors"
        >
          <span>Inspect Wave</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

