import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConversation } from '../services/conversationApi';
import { getConversationAnalysis } from '../services/analysisApi';
import { getSecurityIntelligenceForConversation } from '../services/securityApi';
import { Conversation } from '../types/conversation';
import { CustomerIntelligence } from '../types/analysis';
import { SecurityIntelligence } from '../types/security';
import { ConversationTimeline } from '../components/conversations/ConversationTimeline';
import { AiInsightPanel } from '../components/conversations/AiInsightPanel';
import { SecurityInsightPanel } from '../components/security/SecurityInsightPanel';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { ErrorState } from '../components/common/ErrorState';
import {
  ChevronLeft,
  ShieldAlert,
  Lock,
  CheckCircle2,
  RefreshCw,
  User,
  ArrowRight,
  Send,
} from 'lucide-react';

export const ConversationDetails: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [customerAi, setCustomerAi] = useState<CustomerIntelligence | null>(null);
  const [securityAi, setSecurityAi] = useState<SecurityIntelligence | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containmentApplied, setContainmentApplied] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  const loadAllDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [conv, custAnalysis, secAnalysis] = await Promise.all([
        getConversation(id),
        getConversationAnalysis(id),
        getSecurityIntelligenceForConversation(id),
      ]);
      setConversation(conv);
      setCustomerAi(custAnalysis);
      setSecurityAi(secAnalysis);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversation details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllDetails();
  }, [id]);

  if (error || (!isLoading && !conversation)) {
    return (
      <ErrorState
        title="Conversation not found"
        message={error || `Could not find records for ticket ${id}`}
        onRetry={loadAllDetails}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface rounded-2xl border border-surface-border shadow-card">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate('/conversations')}
            className="p-2 rounded-xl border border-surface-border bg-surface-elevated hover:bg-slate-200 dark:hover:bg-surface-lighter text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
            title="Back to conversations"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-brand-cyan dark:text-brand-cyan font-bold px-2.5 py-0.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30">
                {id}
              </span>
              {conversation && <RiskBadge level={conversation.security_risk} size="sm" />}
              {conversation && <PriorityBadge priority={conversation.priority} />}
              {conversation && <StatusBadge status={isResolved ? 'Resolved' : conversation.status} />}
              {conversation && <SentimentBadge sentiment={conversation.sentiment} />}
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5 font-sans flex items-center gap-2">
              <span>{conversation?.customer_name}</span>
              <span className="text-xs font-mono font-normal text-slate-500 dark:text-slate-400">({conversation?.channel})</span>
            </h1>
          </div>
        </div>

        {/* Analyst Actions */}
        <div className="flex items-center gap-2.5">
          {securityAi?.threat_detected && (
            <button
              onClick={() => setContainmentApplied(true)}
              disabled={containmentApplied}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                containmentApplied
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 cursor-default'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm font-bold'
              }`}
            >
              {containmentApplied ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Domain Quarantined</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Quarantine Domain</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setIsResolved(!isResolved)}
            className="px-4 py-2 rounded-xl border border-surface-border bg-surface-elevated hover:bg-slate-200 dark:hover:bg-surface-lighter text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold transition-all shadow-sm"
          >
            {isResolved ? 'Reopen Ticket' : 'Mark as Resolved'}
          </button>

          <button
            onClick={loadAllDetails}
            className="p-2 rounded-xl border border-surface-border bg-surface-elevated hover:bg-slate-200 dark:hover:bg-surface-lighter text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
            title="Refresh analysis"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Two-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Messages (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {conversation && <ConversationTimeline conversation={conversation} />}
        </div>

        {/* Right Column: AI Customer Intelligence + Security Intelligence (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <AiInsightPanel intelligence={customerAi} isLoading={isLoading} />
          <SecurityInsightPanel intelligence={securityAi} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
