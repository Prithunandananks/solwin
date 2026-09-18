import React, { useState } from 'react';
import { SuspiciousUrl } from '../../types/security';
import { ExternalLink, ChevronDown, ChevronUp, ShieldAlert, Check, X } from 'lucide-react';

interface UrlAnalysisCardProps {
  urlData: SuspiciousUrl;
}

export const UrlAnalysisCard: React.FC<UrlAnalysisCardProps> = ({ urlData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-colors shadow-sm">
      <div
        className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
            <ShieldAlert size={16} />
          </div>
          <div className="truncate">
            <span className="font-mono text-xs font-semibold text-slate-900 block truncate" title={urlData.url}>
              {urlData.url}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Domain: <strong className="text-slate-800">{urlData.domain}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-3">
          {urlData.risk_contribution && (
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              +{urlData.risk_contribution} Risk
            </span>
          )}
          <button className="text-slate-400 hover:text-slate-700">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 block mb-0.5">HTTPS Encrypted</span>
              <span className="font-semibold flex items-center gap-1">
                {urlData.https ? (
                  <>
                    <Check size={13} className="text-emerald-600" /> Yes
                  </>
                ) : (
                  <>
                    <X size={13} className="text-rose-600" /> No
                  </>
                )}
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Lookalike Domain</span>
              <span className={`font-semibold flex items-center gap-1 ${urlData.lookalike_domain ? 'text-rose-600' : 'text-slate-700'}`}>
                {urlData.lookalike_domain ? 'Detected (Impersonation)' : 'Clean'}
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 block mb-0.5">IP-Based URL</span>
              <span className="font-semibold text-slate-700">
                {urlData.ip_based_url ? 'Yes (Raw IP)' : 'No (FQDN)'}
              </span>
            </div>
          </div>

          {urlData.domain_reputation && (
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Domain Reputation</span>
              <span className="text-xs font-mono text-rose-700">{urlData.domain_reputation}</span>
            </div>
          )}

          {urlData.suspicious_pattern && (
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Suspicious Pattern</span>
              <span className="text-xs text-amber-800">{urlData.suspicious_pattern}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
