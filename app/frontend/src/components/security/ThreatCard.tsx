import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreatRecord } from '../../types/security';
import { RiskBadge } from '../common/RiskBadge';
import { ShieldAlert, ArrowRight, Clock, User, Globe } from 'lucide-react';

interface ThreatCardProps {
  threat: ThreatRecord;
}

export const ThreatCard: React.FC<ThreatCardProps> = ({ threat }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900/70 border border-slate-800 hover:border-slate-750 rounded-xl p-4 transition-all hover:shadow-glow-sm flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert size={16} />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-slate-300">{threat.id}</span>
              <h4 className="text-sm font-semibold text-white">{threat.threat_type}</h4>
            </div>
          </div>
          <RiskBadge level={threat.risk_level} size="sm" />
        </div>

        <div className="space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <User size={12} className="text-slate-500" />
            <span className="text-slate-300 font-medium">{threat.customer_name}</span>
            <span className="text-slate-500">•</span>
            <span className="capitalize">{threat.channel}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={12} className="text-slate-500" />
            <span className="font-mono text-[11px] text-slate-400">{threat.detected_at}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
          Status: {threat.status}
        </span>

        <button
          onClick={() => navigate(`/threats/${threat.id}`)}
          className="inline-flex items-center gap-1 text-brand-blue hover:text-brand-cyan font-medium transition-colors"
        >
          Details
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
