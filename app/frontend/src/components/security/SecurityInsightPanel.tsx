import React from 'react';
import { SecurityIntelligence } from '../../types/security';
import { RiskBadge } from '../common/RiskBadge';
import { UrlAnalysisCard } from './UrlAnalysisCard';
import { EmailAnalysisCard } from './EmailAnalysisCard';
import { ShieldAlert, ShieldCheck, AlertOctagon } from 'lucide-react';

interface SecurityInsightPanelProps {
  intelligence: SecurityIntelligence | null;
  isLoading?: boolean;
}

export const SecurityInsightPanel: React.FC<SecurityInsightPanelProps> = ({
  intelligence,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-5 animate-pulse space-y-4">
        <div className="h-4 w-40 bg-slate-800 rounded" />
        <div className="h-16 bg-slate-800/40 rounded" />
      </div>
    );
  }

  if (!intelligence) {
    return (
      <div className="bg-slate-900/40 border border-white/5 rounded-xl p-6 text-center text-slate-400 text-xs">
        No security telemetry recorded for this session.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-rose-400">
          <ShieldAlert size={16} />
          <h2 className="text-xs font-semibold text-slate-200">
            Security telemetry & threat scan
          </h2>
        </div>
        <RiskBadge level={intelligence.risk_level} />
      </div>

      {/* Threat Status & Details Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-lg border border-white/5">
        <div>
          <span className="text-[11px] text-slate-400 block mb-1">Threat detected</span>
          {intelligence.threat_detected ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400">
              <ShieldAlert size={13} /> Yes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <ShieldCheck size={13} /> None
            </span>
          )}
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block mb-1">Classification</span>
          <span className="text-xs font-medium text-slate-200 block truncate" title={intelligence.threat_type || 'None'}>
            {intelligence.threat_type || 'Benign'}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block mb-1">Social engineering</span>
          <span className={`text-xs font-medium ${intelligence.social_engineering ? 'text-amber-300' : 'text-slate-400'}`}>
            {intelligence.social_engineering ? 'Confirmed' : 'None'}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block mb-1">Risk score</span>
          <span className="text-xs font-mono font-semibold text-rose-400">
            {intelligence.risk_score ? `${intelligence.risk_score}/100` : 'Assessed'}
          </span>
        </div>
      </div>

      {/* Contributing Factors Breakdown */}
      {intelligence.contributing_factors && intelligence.contributing_factors.length > 0 && (
        <div className="bg-slate-950/70 border border-white/5 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/5">
            <span className="text-xs font-medium text-slate-300">
              Contributing risk factors
            </span>
            <span className="font-mono text-xs text-rose-400">
              Score: {intelligence.risk_score || 95} ({intelligence.risk_level.toLowerCase()})
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {intelligence.contributing_factors.map((factor, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{factor.factor}</span>
                <span className="font-mono text-xs text-rose-400">+{factor.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Engineering Tactics */}
      {intelligence.techniques && intelligence.techniques.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-medium text-slate-300 block">
            Observed deception techniques ({intelligence.techniques.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {intelligence.techniques.map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-white/5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suspicious URLs */}
      {intelligence.suspicious_urls && intelligence.suspicious_urls.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-medium text-slate-300 block">
            Flagged destination URLs ({intelligence.suspicious_urls.length})
          </span>
          <div className="space-y-2">
            {intelligence.suspicious_urls.map((url, i) => (
              <UrlAnalysisCard key={i} urlData={url} />
            ))}
          </div>
        </div>
      )}

      {/* Suspicious Emails */}
      {intelligence.suspicious_emails && intelligence.suspicious_emails.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-medium text-slate-300 block">
            Sender analysis & domain verification ({intelligence.suspicious_emails.length})
          </span>
          <div className="space-y-2">
            {intelligence.suspicious_emails.map((em, i) => (
              <EmailAnalysisCard key={i} emailData={em} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action */}
      {intelligence.recommended_action && (
        <div className="p-3.5 rounded-lg bg-rose-500/[0.04] border border-rose-500/20 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-rose-300">
            <AlertOctagon size={14} />
            <span>Recommended incident protocol</span>
          </div>
          <p className="text-xs text-rose-200/90 leading-relaxed">
            {intelligence.recommended_action}
          </p>
        </div>
      )}
    </div>
  );
};
