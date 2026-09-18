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
        return <Mail size={13} className="text-blue-400" />;
      case 'chat':
        return <MessageSquare size={13} className="text-emerald-400" />;
      case 'sms':
        return <Smartphone size={13} className="text-purple-400" />;
      case 'phone':
        return <Phone size={13} className="text-amber-400" />;
      case 'social':
        return <Share2 size={13} className="text-cyan-400" />;
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-brand-cyan">
              OMNICHANNEL INGESTION GRID
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
            <span>Conversations & Tickets</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-brand-blue/15 text-brand-cyan border border-brand-blue/30 font-semibold">
              {total} Total Records
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Omnichannel customer inquiries parsed for NLP emotion sentiment, operational priority, and embedded cybersecurity threats.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-card/85 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 space-y-3.5 shadow-sm">
        <SearchBar
          placeholder="Filter by customer name, ticket ID, keywords, or issue description..."
          value={search}
          onChange={(q) => {
            setSearch(q);
            setPage(1);
          }}
          className="w-full"
        />

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <select
            value={securityRisk}
            onChange={(e) => {
              setSecurityRisk(e.target.value);
              setPage(1);
            }}
            className="bg-surface-elevated/90 border border-white/10 hover:border-white/20 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none text-xs cursor-pointer"
          >
            <option value="">All security risks</option>
            <option value="CRITICAL">Critical risk</option>
            <option value="HIGH">High risk</option>
            <option value="MEDIUM">Medium risk</option>
            <option value="LOW">Low risk</option>
          </select>

          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
            className="bg-surface-elevated/90 border border-white/10 hover:border-white/20 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none text-xs cursor-pointer"
          >
            <option value="">All priorities</option>
            <option value="Critical">Critical priority</option>
            <option value="High">High priority</option>
            <option value="Medium">Medium priority</option>
            <option value="Low">Low priority</option>
          </select>

          <select
            value={channel}
            onChange={(e) => {
              setChannel(e.target.value);
              setPage(1);
            }}
            className="bg-surface-elevated/90 border border-white/10 hover:border-white/20 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none text-xs cursor-pointer"
          >
            <option value="">All channels</option>
            <option value="email">Email</option>
            <option value="chat">Chat</option>
            <option value="sms">SMS</option>
            <option value="phone">Phone transcript</option>
            <option value="social">Social</option>
          </select>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="bg-surface-elevated/90 border border-white/10 hover:border-white/20 text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none text-xs cursor-pointer"
          >
            <option value="">All categories</option>
            <option value="Account Security">Account Security</option>
            <option value="Billing">Billing</option>
            <option value="Fraud & Wire">Fraud & Wire</option>
            <option value="Technical Problems">Technical Problems</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-brand-cyan hover:text-sky-300 px-2 py-1 font-medium transition-colors"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Conversations Table (7 or 12 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-white/[0.08] bg-surface-card/85 backdrop-blur-md overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-4">
              <TableSkeleton rows={6} />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No conversations found"
                description="Try adjusting your filter options or search terms."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#070a14]/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Channel</th>
                    <th className="py-3.5 px-4">Issue synopsis</th>
                    <th className="py-3.5 px-4">Security risk</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4 text-right">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {conversations.map((item) => {
                    const isSelected = selectedConv?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedConv(item)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-950/30 border-l-2 border-indigo-500'
                            : 'hover:bg-slate-900/50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-100">{item.customer_name}</div>
                          <div className="text-[11px] font-mono text-slate-400">{item.id}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-slate-300 capitalize">
                            {channelIcon(item.channel)}
                            <span>{item.channel}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="truncate text-slate-300" title={item.issue}>
                            {item.issue}
                          </div>
                          <div className="text-[11px] text-slate-400">{item.category}</div>
                        </td>
                        <td className="py-3 px-4">
                          <RiskBadge level={item.security_risk} size="sm" />
                        </td>
                        <td className="py-3 px-4">
                          <PriorityBadge priority={item.priority} />
                        </td>
                        <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                          {item.updated_at}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Triage Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-surface-card/85 backdrop-blur-md p-5 space-y-4 sticky top-20 shadow-sm">
          {selectedConv ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="text-[11px] font-mono text-brand-cyan font-bold">{selectedConv.id}</span>
                  <h2 className="text-sm font-bold text-white mt-0.5 font-sans">{selectedConv.customer_name}</h2>
                  <p className="text-xs text-slate-400 font-mono">{selectedConv.customer_email || selectedConv.channel}</p>
                </div>
                <RiskBadge level={selectedConv.security_risk} size="sm" />
              </div>

              <div className="space-y-2 text-xs">
                <span className="text-slate-400 font-medium font-mono text-[11px] block">ISSUE SYNOPSIS:</span>
                <p className="text-slate-200 bg-[#070a14]/80 p-3 rounded-xl border border-white/[0.06] leading-relaxed">
                  {selectedConv.issue}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface-elevated/40 border border-white/[0.06]">
                  <span className="text-slate-400 block text-[10px] font-mono uppercase mb-1">Workflow Status</span>
                  <StatusBadge status={selectedConv.status} />
                </div>
                <div className="p-2.5 rounded-xl bg-surface-elevated/40 border border-white/[0.06]">
                  <span className="text-slate-400 block text-[10px] font-mono uppercase mb-1">Sentiment</span>
                  <SentimentBadge sentiment={selectedConv.sentiment} />
                </div>
              </div>

              {selectedConv.messages && selectedConv.messages.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-400 font-medium font-mono text-[11px] block">LATEST INBOUND PAYLOAD:</span>
                  <div className="p-3 rounded-xl bg-[#070a14]/90 border border-white/[0.06] text-slate-300 text-xs leading-relaxed max-h-36 overflow-y-auto font-mono text-[11px]">
                    {selectedConv.messages[0].content}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => navigate(`/conversations/${selectedConv.id}`)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-blue hover:from-indigo-600 hover:to-blue-600 text-white text-xs font-semibold font-mono tracking-wider uppercase transition-all shadow-glow-sm flex items-center justify-center gap-2 group"
                >
                  <span>Open Full Investigation</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs font-mono text-slate-500">
              Select a ticket row to inspect automated intelligence telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
