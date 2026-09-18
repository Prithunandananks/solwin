import React from 'react';
import { CustomerIntelligence } from '../../types/analysis';
import { SentimentBadge } from '../common/SentimentBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';

interface AiInsightPanelProps {
  intelligence: CustomerIntelligence | null;
  isLoading?: boolean;
}

export const AiInsightPanel: React.FC<AiInsightPanelProps> = ({ intelligence, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-surface rounded-2xl border border-surface-border p-5 animate-pulse space-y-4 shadow-card">
        <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="space-y-2">
          <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800/60 rounded-md" />
          <div className="h-3.5 w-3/4 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
        </div>
      </div>
    );
  }

  if (!intelligence) {
    return (
      <div className="bg-surface rounded-2xl border border-surface-border p-6 text-center text-slate-500 text-xs font-mono shadow-card">
        No customer intelligence analysis available for this conversation.
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-surface-border p-5 space-y-5 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-brand-cyan">
          <Sparkles size={16} />
          <h2 className="text-xs font-semibold text-slate-900 dark:text-white font-sans">
            Customer Intelligence & NLP Triage
          </h2>
        </div>
        <span className="text-[11px] text-cyan-700 dark:text-brand-cyan font-mono px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 font-bold uppercase tracking-widest">
          AI VERIFIED
        </span>
      </div>

      {/* Grid of Key Properties */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-elevated/60 border border-slate-200/80 dark:border-surface-border">
          <span className="text-slate-500 text-[11px] font-mono uppercase tracking-widest block mb-1">Category</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200">{intelligence.category}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-elevated/60 border border-slate-200/80 dark:border-surface-border">
          <span className="text-slate-500 text-[11px] font-mono uppercase tracking-widest block mb-1">Issue Synopsis</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200 truncate block" title={intelligence.issue}>
            {intelligence.issue}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-elevated/60 border border-slate-200/80 dark:border-surface-border">
          <span className="text-slate-500 text-[11px] font-mono uppercase tracking-widest block mb-1">Sentiment</span>
          <SentimentBadge sentiment={intelligence.sentiment} />
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-elevated/60 border border-slate-200/80 dark:border-surface-border">
          <span className="text-slate-500 text-[11px] font-mono uppercase tracking-widest block mb-1">Detected Emotion</span>
          <span className="text-slate-900 dark:text-slate-200 font-semibold font-mono">
            {intelligence.emotion || 'Neutral'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-elevated/60 border border-slate-200/80 dark:border-surface-border">
          <span className="text-slate-500 text-[11px] font-mono uppercase tracking-widest block mb-1">Urgency Priority</span>
          <PriorityBadge priority={intelligence.priority} />
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-elevated/60 border border-slate-200/80 dark:border-surface-border">
          <span className="text-slate-500 text-[11px] font-mono uppercase tracking-widest block mb-1">Workflow Status</span>
          <StatusBadge status={intelligence.resolution_status} />
        </div>
      </div>

      {/* Customer Request */}
      {intelligence.customer_request && (
        <div className="bg-slate-50 dark:bg-surface-elevated/80 border border-slate-200/80 dark:border-surface-border rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-brand-cyan">
            <HelpCircle size={13} className="text-blue-600 dark:text-brand-cyan" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">Extracted Intent</span>
          </div>
          <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-medium">{intelligence.customer_request}</p>
        </div>
      )}

      {/* Summary */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 font-semibold block">
          Incident Summary
        </span>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-surface-elevated/40 p-3.5 rounded-xl border border-slate-200/70 dark:border-surface-border">
          {intelligence.summary}
        </p>
      </div>

      {/* Recommended Action */}
      {intelligence.recommended_action && (
        <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 text-[11px] font-mono font-bold uppercase tracking-widest">
            <CheckCircle2 size={14} />
            <span>AI Suggested Mitigation Protocol</span>
          </div>
          <p className="text-xs text-indigo-900 dark:text-slate-200 leading-relaxed font-medium">
            {intelligence.recommended_action}
          </p>
        </div>
      )}
    </div>
  );
};
