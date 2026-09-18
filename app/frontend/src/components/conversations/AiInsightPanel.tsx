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
      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-5 animate-pulse space-y-4">
        <div className="h-4 w-36 bg-slate-800 rounded" />
        <div className="space-y-2">
          <div className="h-3.5 w-full bg-slate-800/60 rounded" />
          <div className="h-3.5 w-3/4 bg-slate-800/60 rounded" />
        </div>
      </div>
    );
  }

  if (!intelligence) {
    return (
      <div className="bg-slate-900/40 border border-white/5 rounded-xl p-6 text-center text-slate-400 text-xs">
        No customer intelligence analysis available for this conversation.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900">
          <Sparkles size={16} />
          <h2 className="text-xs font-semibold text-slate-900">
            Customer intelligence
          </h2>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          NLP triage
        </span>
      </div>

      {/* Grid of Key Properties */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-slate-500 text-[11px] block mb-1">Category</span>
          <span className="font-medium text-slate-900">{intelligence.category}</span>
        </div>

        <div>
          <span className="text-slate-500 text-[11px] block mb-1">Issue synopsis</span>
          <span className="font-medium text-slate-900 truncate block" title={intelligence.issue}>
            {intelligence.issue}
          </span>
        </div>

        <div>
          <span className="text-slate-500 text-[11px] block mb-1">Sentiment</span>
          <SentimentBadge sentiment={intelligence.sentiment} />
        </div>

        <div>
          <span className="text-slate-500 text-[11px] block mb-1">Detected emotion</span>
          <span className="text-slate-800 font-medium">
            {intelligence.emotion || 'Neutral'}
          </span>
        </div>

        <div>
          <span className="text-slate-500 text-[11px] block mb-1">Urgency priority</span>
          <PriorityBadge priority={intelligence.priority} />
        </div>

        <div>
          <span className="text-slate-500 text-[11px] block mb-1">Workflow status</span>
          <StatusBadge status={intelligence.resolution_status} />
        </div>
      </div>

      {/* Customer Request */}
      {intelligence.customer_request && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <HelpCircle size={13} className="text-slate-900" />
            <span className="font-medium text-slate-900">Customer request</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{intelligence.customer_request}</p>
        </div>
      )}

      {/* Summary */}
      <div className="space-y-1">
        <span className="text-xs text-slate-500 font-medium block">
          Incident summary
        </span>
        <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
          {intelligence.summary}
        </p>
      </div>

      {/* Recommended Action */}
      {intelligence.recommended_action && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
            <CheckCircle2 size={13} />
            <span>Recommended triage step</span>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            {intelligence.recommended_action}
          </p>
        </div>
      )}
    </div>
  );
};
