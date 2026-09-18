import React from 'react';
import { SecurityIntelligence } from '../../types/security';
import { RiskBadge } from '../common/RiskBadge';
import { UrlAnalysisCard } from './UrlAnalysisCard';
import { EmailAnalysisCard } from './EmailAnalysisCard';
import { ShieldAlert, ShieldCheck, AlertOctagon, Terminal } from 'lucide-react';

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
      <div className="bg-surface-card border border-surface-border rounded-2xl p-5 animate-pulse space-y-4 shadow-card">
        <div className="h-4 w-40 bg-slate-800 rounded-md" />
        <div className="h-16 bg-slate-800/40 rounded-xl" />
      </div>
    );
  }

  if (!intelligence) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6 text-center text-slate-500 text-xs font-mono">
        No security telemetry recorded for this session.
      </div>
    );
  }

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-5 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2 text-rose-400">
          <ShieldAlert size={16} />
          <h2 className="text-xs font-semibold text-white font-sans">
            Security Telemetry & Threat Scan
          </h2>
        </div>
        <RiskBadge level={intelligence.risk_level} />
      </div>

      {/* Threat Status & Details Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-elevated/70 p-3.5 rounded-xl border border-surface-border">
        <div>
          <span className="text-[10px] font-mono text-slate-500 block mb-1">Threat Detected</span>
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
          <span className="text-[10px] font-mono text-slate-500 block mb-1">Classification</span>
          <span className="text-xs font-medium text-slate-200 block truncate" title={intelligence.threat_type || 'None'}>
            {intelligence.threat_type || 'Benign'}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono text-slate-500 block mb-1">Social Engineering</span>
          <span className={`text-xs font-medium ${intelligence.social_engineering ? 'text-amber-300 font-semibold' : 'text-slate-400'}`}>
            {intelligence.social_engineering ? 'Confirmed' : 'None'}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono text-slate-500 block mb-1">Risk Score</span>
          <span className="text-xs font-mono font-bold text-rose-400">
            {intelligence.risk_score ? `${intelligence.risk_score}/100` : 'Assessed'}
          </span>
        </div>
      </div>

      {/* Contributing Factors Breakdown */}
      {intelligence.contributing_factors && intelligence.contributing_factors.length > 0 && (
        <div className="bg-surface-elevated/50 border border-surface-border rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-surface-border">
            <span className="text-xs font-mono font-bold uppercase text-slate-300">
              Contributing Risk Factors
            </span>
            <span className="font-mono text-xs text-rose-400 font-semibold">
              Cumulative: {intelligence.risk_score || 95}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {intelligence.contributing_factors.map((factor, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{factor.factor}</span>
                <span className="font-mono text-xs text-rose-400 font-semibold">+{factor.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MITRE ATT&CK Techniques */}
      {intelligence.techniques && intelligence.techniques.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
            Observed Social Engineering Tactics
          </span>
          <div className="flex flex-wrap gap-1.5">
            {intelligence.techniques.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/25 text-xs font-mono"
              >
                • {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suspicious URLs */}
      {intelligence.suspicious_urls && intelligence.suspicious_urls.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
            Suspicious URLs ({intelligence.suspicious_urls.length})
          </span>
          <div className="space-y-2">
            {intelligence.suspicious_urls.map((url, idx) => (
              <UrlAnalysisCard key={idx} urlData={url} />
            ))}
          </div>
        </div>
      )}

      {/* Suspicious Email Indicators */}
      {intelligence.suspicious_emails && intelligence.suspicious_emails.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
            Email Header Diagnostics ({intelligence.suspicious_emails.length})
          </span>
          <div className="space-y-2">
            {intelligence.suspicious_emails.map((email, idx) => (
              <EmailAnalysisCard key={idx} emailData={email} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action */}
      {intelligence.recommended_action && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5 shadow-glow-rose/10">
          <div className="flex items-center gap-2 text-rose-300 font-mono text-xs font-bold uppercase">
            <AlertOctagon size={15} />
            <span>Recommended Incident Mitigation Protocol</span>
          </div>
          <p className="text-xs text-rose-200 leading-relaxed font-sans">
            {intelligence.recommended_action}
          </p>
        </div>
      )}
    </div>
  );
};
