import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getConversations } from '../services/conversationApi';
import { Conversation, ConversationFilterParams } from '../types/conversation';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import {
  MessageSquare,
  Mail,
  Smartphone,
  Phone,
  Share2,
  FileText,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  X,
  Filter,
  RefreshCw,
} from 'lucide-react';

export const Conversations: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sentiment, setSentiment] = useState(searchParams.get('sentiment') || '');
  const [priority, setPriority] = useState(searchParams.get('priority') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [securityRisk, setSecurityRisk] = useState(searchParams.get('security_risk') || '');
  const [channel, setChannel] = useState(searchParams.get('channel') || '');

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const params: ConversationFilterParams = {
        search: search || undefined,
        category: category || undefined,
        sentiment: (sentiment as any) || undefined,
        priority: (priority as any) || undefined,
        status: (status as any) || undefined,
        security_risk: (securityRisk as any) || undefined,
        channel: (channel as any) || undefined,
        page,
        limit: 10,
      };

      const res = await getConversations(params);
      setConversations(res.data);
      setTotal(res.total);
      setTotalPages(res.total_pages);
      if (res.data.length > 0 && !selectedConv) {
        setSelectedConv(res.data[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [search, category, sentiment, priority, status, securityRisk, channel, page]);

  const channelIcon = (ch: string) => {
    switch (ch) {
      case 'email':
        return <Mail size={13} className="text-cyan-400" />;
      case 'chat':
        return <MessageSquare size={13} className="text-emerald-400" />;
      case 'sms':
        return <Smartphone size={13} className="text-purple-400" />;
      case 'phone':
        return <Phone size={13} className="text-amber-400" />;
      case 'social':
        return <Share2 size={13} className="text-pink-400" />;
      default:
        return <FileText size={13} className="text-slate-400" />;
    }
  };

  const hasActiveFilters = category || sentiment || priority || status || securityRisk || channel;

  const resetFilters = () => {
    setCategory('');
    setSentiment('');
    setPriority('');
    setStatus('');
    setSecurityRisk('');
    setChannel('');
    setSearch('');
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-brand-cyan">
              OMNICHANNEL INGESTION GRID
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
            <span>Conversations & Support Triage</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Multi-channel ticket stream triaged with automated sentiment detection, emotion classification, and zero-trust security threat scanning.
          </p>
        </div>

        <button
          onClick={loadConversations}
          className="p-2.5 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-elevated text-slate-400 hover:text-slate-100 transition-all self-start sm:self-auto shadow-sm"
          title="Refresh ticket queue"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-3 shadow-card">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder="Search by customer name, ticket ID, or issue..."
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={securityRisk}
              onChange={(e) => {
                setSecurityRisk(e.target.value);
                setPage(1);
              }}
              className="bg-surface-elevated border border-surface-border hover:border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-cyan/50 cursor-pointer font-sans"
            >
              <option value="">Security Risk (All)</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>

            <select
              value={channel}
              onChange={(e) => {
                setChannel(e.target.value);
                setPage(1);
              }}
              className="bg-surface-elevated border border-surface-border hover:border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-cyan/50 cursor-pointer font-sans"
            >
              <option value="">Channel (All)</option>
              <option value="email">Email</option>
              <option value="chat">Chat</option>
              <option value="sms">SMS</option>
              <option value="phone">Phone</option>
              <option value="social">Social</option>
            </select>

            <select
              value={sentiment}
              onChange={(e) => {
                setSentiment(e.target.value);
                setPage(1);
              }}
              className="bg-surface-elevated border border-surface-border hover:border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-cyan/50 cursor-pointer font-sans"
            >
              <option value="">Sentiment (All)</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-xl text-xs font-mono text-brand-cyan hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <X size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Conversation List (Left) + Selected Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Ticket Feed (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-surface-border bg-surface-card p-5 space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <span className="font-mono text-xs font-semibold uppercase text-slate-400">
              Active Queue ({total} Inquiries)
            </span>
            <span className="text-[11px] font-mono text-slate-500">Page {page} of {totalPages || 1}</span>
          </div>

          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : conversations.length === 0 ? (
            <EmptyState
              title="No tickets match active filters"
              description="Try adjusting your search criteria or resetting filters to view inbound inquiries."
              action={{ label: 'Clear Filters', onClick: resetFilters }}
            />
          ) : (
            <div className="divide-y divide-surface-border">
              {conversations.map((conv) => {
                const isSelected = selectedConv?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`py-3.5 px-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-surface-elevated border-l-2 border-l-brand-cyan shadow-sm'
                        : 'hover:bg-surface-elevated/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            {channelIcon(conv.channel)}
                            <span className="font-bold text-xs text-slate-200">
                              {conv.customer_name}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">• {conv.id}</span>
                          <span className="text-[10px] font-mono text-slate-500">• {conv.updated_at}</span>
                        </div>

                        <p className="text-xs text-slate-300 font-medium truncate">{conv.issue}</p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <PriorityBadge priority={conv.priority} />
                          <SentimentBadge sentiment={conv.sentiment} />
                          <StatusBadge status={conv.status} />
                        </div>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        <RiskBadge level={conv.security_risk} size="sm" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                Showing {conversations.length} of {total}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg border border-surface-border bg-surface-elevated text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg border border-surface-border bg-surface-elevated text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview Drawer (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-5 shadow-card sticky top-24">
          {selectedConv ? (
            <>
              <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-surface-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-brand-cyan font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      {selectedConv.id}
                    </span>
                    <RiskBadge level={selectedConv.security_risk} size="sm" />
                  </div>
                  <h2 className="text-base font-bold text-white mt-1.5 font-sans">
                    {selectedConv.customer_name}
                  </h2>
                  <span className="text-xs font-mono text-slate-400">{selectedConv.customer_email}</span>
                </div>

                <button
                  onClick={() => navigate(`/conversations/${selectedConv.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-brand-cyan hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-glow-cyan/30"
                >
                  <span>Open Ticket</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              {/* Synopsis & Key Attributes */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-surface-elevated/80 border border-surface-border space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                    Issue Synopsis
                  </span>
                  <p className="text-slate-200 leading-relaxed">{selectedConv.issue}</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-surface-elevated/60 border border-surface-border">
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">Category</span>
                    <span className="font-semibold text-slate-200">{selectedConv.category}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-elevated/60 border border-surface-border">
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">Vector Channel</span>
                    <span className="font-mono uppercase text-slate-200">{selectedConv.channel}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-elevated/60 border border-surface-border">
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">Urgency Priority</span>
                    <PriorityBadge priority={selectedConv.priority} />
                  </div>
                  <div className="p-3 rounded-xl bg-surface-elevated/60 border border-surface-border">
                    <span className="text-[10px] font-mono text-slate-500 block mb-1">NLP Sentiment</span>
                    <SentimentBadge sentiment={selectedConv.sentiment} />
                  </div>
                </div>

                {/* Threat Banner in preview if flagged */}
                {selectedConv.security_risk === 'CRITICAL' && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-1 shadow-glow-rose/20">
                    <div className="flex items-center gap-1.5 text-rose-300 font-bold font-mono">
                      <ShieldAlert size={14} />
                      <span>FLAGGED BY ZERO-TRUST ENGINE</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Suspicious credential harvesting and phishing patterns detected in payload. Immediate SOC review required.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate(`/conversations/${selectedConv.id}`)}
                  className="w-full py-2.5 rounded-xl bg-surface-elevated hover:bg-slate-800 border border-surface-border text-slate-200 hover:text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageSquare size={14} className="text-brand-cyan" />
                  <span>Inspect Full Communication Timeline</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              Select a conversation to preview telemetry and AI insights
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
