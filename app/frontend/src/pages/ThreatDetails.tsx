import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getThreat } from '../services/securityApi';
import { ThreatRecord } from '../types/security';
import { RiskBadge } from '../components/common/RiskBadge';
import { UrlAnalysisCard } from '../components/security/UrlAnalysisCard';
import { EmailAnalysisCard } from '../components/security/EmailAnalysisCard';
import { ErrorState } from '../components/common/ErrorState';
import {
  ChevronLeft,
  ShieldAlert,
  Clock,
  User,
  MessageSquare,
  AlertOctagon,
  ExternalLink,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const ThreatDetails: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [threat, setThreat] = useState<ThreatRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mitigationApplied, setMitigationApplied] = useState(false);

  const loadThreatDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getThreat(id);
      setThreat(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load threat details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadThreatDetails();
  }, [id]);

  if (error || (!isLoading && !threat)) {
    return (
      <ErrorState
        title="Threat Record Unavailable"
        message={error || `Threat telemetry record ${id} was not found.`}
        onRetry={loadThreatDetails}
      />
    );
  }

  const intel = threat?.intelligence;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/threats')}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-rose-300">{threat?.id}</span>
              {threat && <RiskBadge level={threat.risk_level} />}
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {threat?.status}
              </span>
            </div>
            <h1 className="text-base font-semibold text-white mt-0.5">{threat?.threat_type}</h1>
          </div>
        </div>

        {/* Action / Escalation Buttons */}
        <div className="flex items-center gap-2">
          {threat?.conversation_id && (
            <button
              onClick={() => navigate(`/conversations/${threat.conversation_id}`)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <MessageSquare size={14} />
              <span>Inspect Source Ticket</span>
              <ExternalLink size={12} />
            </button>
          )}

          <button
            onClick={() => setMitigationApplied(true)}
            disabled={mitigationApplied}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-semibold transition-all shadow-glow-danger flex items-center gap-1.5 disabled:bg-emerald-800 disabled:shadow-none"
          >
            {mitigationApplied ? (
              <>
                <CheckCircle2 size={14} />
                <span>IOC Quarantined Globally</span>
              </>
            ) : (
              <>
                <Lock size={14} />
                <span>Trigger Emergency EDR Block</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1">Target Account</span>
          <span className="text-sm font-semibold text-white">{threat?.customer_name}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1">Attack Channel</span>
          <span className="text-sm font-semibold text-white uppercase font-mono">{threat?.channel}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1">Detection Time</span>
          <span className="text-sm font-mono text-slate-200">{threat?.detected_at}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-500 uppercase block mb-1">Risk Assessment</span>
          <span className="text-sm font-mono font-bold text-rose-400">
            {intel?.risk_score ? `${intel.risk_score}/100 SCORE` : threat?.risk_level}
          </span>
        </div>
      </div>

      {/* Contributing Risk Breakdown */}
      {intel?.contributing_factors && (
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Risk Engine Contributing Factors
            </span>
            <span className="text-xs font-mono text-rose-400">Cumulative Score: {intel.risk_score}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {intel.contributing_factors.map((factor, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs">
                <span className="text-slate-300">{factor.factor}</span>
                <span className="font-mono font-bold text-rose-400">+{factor.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Engineering Tactics */}
      {intel?.techniques && (
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 block">
            Observed Social Engineering Tactics
          </span>
          <div className="flex flex-wrap gap-2">
            {intel.techniques.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/50 text-xs font-medium"
              >
                • {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suspicious URLs */}
      {intel?.suspicious_urls && intel.suspicious_urls.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 block">
            Suspicious Indicators: Malicious URLs ({intel.suspicious_urls.length})
          </span>
          <div className="space-y-3">
            {intel.suspicious_urls.map((url, i) => (
              <UrlAnalysisCard key={i} urlData={url} />
            ))}
          </div>
        </div>
      )}

      {/* Suspicious Email Indicators */}
      {intel?.suspicious_emails && intel.suspicious_emails.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 block">
            Suspicious Indicators: Email Headers & Domains ({intel.suspicious_emails.length})
          </span>
          <div className="space-y-3">
            {intel.suspicious_emails.map((em, i) => (
              <EmailAnalysisCard key={i} emailData={em} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action */}
      {intel?.recommended_action && (
        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-900/50 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
            <AlertOctagon size={16} />
            <span>Recommended Incident Mitigation Protocol</span>
          </div>
          <p className="text-xs text-rose-200 leading-relaxed font-medium">
            {intel.recommended_action}
          </p>
        </div>
      )}
    </div>
  );
};
