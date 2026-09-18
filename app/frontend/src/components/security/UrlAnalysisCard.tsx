import React, { useState } from 'react';
import { SuspiciousUrl } from '../../types/security';
import { ExternalLink, ChevronDown, ChevronUp, ShieldAlert, Check, X } from 'lucide-react';

interface UrlAnalysisCardProps {
  urlData: SuspiciousUrl;
}

export const UrlAnalysisCard: React.FC<UrlAnalysisCardProps> = ({ urlData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden transition-colors">
      <div
        className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
            <ShieldAlert size={16} />
          </div>
          <div className="truncate">
            <span className="font-mono text-xs font-semibold text-slate-200 block truncate" title={urlData.url}>
              {urlData.url}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Domain: <strong className="text-slate-300">{urlData.domain}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-3">
          {urlData.risk_contribution && (
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900/50">
              +{urlData.risk_contribution} Risk
            </span>
          )}
          <button className="text-slate-400 hover:text-slate-200">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block mb-0.5">HTTPS Encrypted</span>
              <span className="font-semibold flex items-center gap-1">
                {urlData.https ? (
                  <>
                    <Check size={13} className="text-emerald-400" /> Yes
                  </>
                ) : (
                  <>
                    <X size={13} className="text-rose-400" /> No
                  </>
                )}
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Lookalike Domain</span>
              <span className={`font-semibold flex items-center gap-1 ${urlData.lookalike_domain ? 'text-rose-400' : 'text-slate-300'}`}>
                {urlData.lookalike_domain ? 'Detected (Impersonation)' : 'Clean'}
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block mb-0.5">IP-Based URL</span>
              <span className="font-semibold text-slate-300">
                {urlData.ip_based_url ? 'Yes (Raw IP)' : 'No (FQDN)'}
              </span>
            </div>
          </div>

          {urlData.domain_reputation && (
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Domain Reputation</span>
              <span className="text-xs font-mono text-rose-300">{urlData.domain_reputation}</span>
            </div>
          )}

          {urlData.suspicious_pattern && (
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Suspicious Pattern</span>
              <span className="text-xs text-amber-300/90">{urlData.suspicious_pattern}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
