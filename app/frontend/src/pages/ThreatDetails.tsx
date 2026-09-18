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
  Terminal,
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/threats')}
            className="p-2 rounded-xl border border-surface-border bg-surface-card text-slate-400 hover:text-white hover:bg-surface-elevated transition-colors shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-rose-400">{threat?.id}</span>
              {threat && <RiskBadge level={threat.risk_level} />}
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-elevated text-slate-300 border border-surface-border">
                {threat?.status}
              </span>
            </div>
            <h1 className="text-lg font-bold text-white mt-1 font-sans">{threat?.threat_type}</h1>
          </div>
        </div>

        {/* Action / Escalation Buttons */}
        <div className="flex items-center gap-2.5">
          {threat?.conversation_id && (
            <button
              onClick={() => navigate(`/conversations/${threat.conversation_id}`)}
              className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-slate-800 text-slate-200 border border-surface-border text-xs font-mono transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare size={14} className="text-brand-cyan" />
              <span>Inspect Source Ticket</span>
              <ExternalLink size={12} />
            </button>
          )}

          <button
            onClick={() => setMitigationApplied(true)}
            disabled={mitigationApplied}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
              mitigationApplied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default shadow-glow-emerald/20'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-glow-rose font-bold'
            }`}
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
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-card">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Target Account</span>
          <span className="text-sm font-semibold text-white">{threat?.customer_name}</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-card">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Attack Channel</span>
          <span className="text-sm font-semibold text-slate-200 uppercase font-mono">{threat?.channel}</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-card">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Detection Time</span>
          <span className="text-sm font-mono text-slate-300">{threat?.detected_at}</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border shadow-card">
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Risk Assessment</span>
          <span className="text-sm font-mono font-bold text-rose-400">
            {intel?.risk_score ? `${intel.risk_score}/100 SCORE` : threat?.risk_level}
          </span>
        </div>
      </div>

      {/* Contributing Risk Breakdown */}
      {intel?.contributing_factors && (
        <div className="p-6 rounded-2xl bg-surface-card border border-surface-border shadow-card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Risk Engine Contributing Factors
            </span>
            <span className="text-xs font-mono text-rose-400 font-semibold">Cumulative Score: {intel.risk_score}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {intel.contributing_factors.map((factor, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated/70 border border-surface-border text-xs">
                <span className="text-slate-300">{factor.factor}</span>
                <span className="font-mono font-bold text-rose-400">+{factor.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Engineering Tactics */}
      {intel?.techniques && (
        <div className="p-6 rounded-2xl bg-surface-card border border-surface-border shadow-card space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 block">
            Observed Social Engineering Tactics (MITRE)
          </span>
          <div className="flex flex-wrap gap-2">
            {intel.techniques.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/25 text-xs font-medium font-mono"
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
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
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
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
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
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2 shadow-glow-rose/15">
          <div className="flex items-center gap-2 text-rose-300 font-mono text-xs font-bold uppercase">
            <AlertOctagon size={16} />
            <span>Recommended Incident Mitigation Protocol</span>
          </div>
          <p className="text-xs text-rose-100 leading-relaxed font-sans">
            {intel.recommended_action}
          </p>
        </div>
      )}
    </div>
  );
};
