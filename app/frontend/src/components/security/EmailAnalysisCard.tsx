import React from 'react';
import { SuspiciousEmail } from '../../types/security';
import { MailWarning, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface EmailAnalysisCardProps {
  emailData: SuspiciousEmail;
}

export const EmailAnalysisCard: React.FC<EmailAnalysisCardProps> = ({ emailData }) => {
  return (
    <div className="bg-surface-elevated/70 border border-surface-border rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <MailWarning size={16} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-200 block truncate max-w-xs">{emailData.sender}</span>
            <span className="text-[10px] text-slate-500">Display: "{emailData.display_name}"</span>
          </div>
        </div>
        <RiskBadge level={emailData.risk} size="sm" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border">
          <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Sender Domain</span>
          <span className="font-mono text-xs text-rose-400 font-semibold">{emailData.email_domain}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border">
          <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Expected Domain</span>
          <span className="font-mono text-xs text-slate-300">{emailData.expected_domain}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border">
          <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Domain Mismatch</span>
          <span className="font-semibold flex items-center gap-1 text-rose-400">
            {!emailData.domain_match ? (
              <>
                <AlertCircle size={12} /> Detected Mismatch
              </>
            ) : (
              <>
                <CheckCircle2 size={12} className="text-emerald-400" /> Matched
              </>
            )}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border">
          <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Lookalike Domain</span>
          <span className={`font-semibold ${emailData.lookalike_domain ? 'text-rose-400' : 'text-slate-300'}`}>
            {emailData.lookalike_domain ? 'Typo-Squatted' : 'No'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-card border border-surface-border">
          <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Impersonation</span>
          <span className={`font-semibold ${emailData.impersonation ? 'text-rose-400' : 'text-slate-300'}`}>
            {emailData.impersonation ? 'Brand Spoofing' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
};
