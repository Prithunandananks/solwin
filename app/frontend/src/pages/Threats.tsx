import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getThreats } from '../services/securityApi';
import { ThreatRecord, ThreatFilterParams } from '../types/security';
import { DataTable, Column } from '../components/common/DataTable';
import { RiskBadge } from '../components/common/RiskBadge';
import { SearchBar } from '../components/common/SearchBar';
import { ShieldAlert, ShieldCheck, ArrowRight, AlertOctagon, Terminal, RefreshCw, Lock } from 'lucide-react';

export const Threats: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [threats, setThreats] = useState<ThreatRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [riskLevel, setRiskLevel] = useState(searchParams.get('risk') || '');
  const [threatType, setThreatType] = useState(searchParams.get('type') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [channel, setChannel] = useState(searchParams.get('channel') || '');

  const loadThreats = async () => {
    setIsLoading(true);
    try {
      const params: ThreatFilterParams = {
        risk_level: (riskLevel as any) || undefined,
        threat_type: threatType || undefined,
        status: status || undefined,
        channel: channel || undefined,
        page,
        limit: 10,
      };

      const res = await getThreats(params);
      let list = res.data;
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (t) =>
            t.id.toLowerCase().includes(q) ||
            t.threat_type.toLowerCase().includes(q) ||
            t.customer_name.toLowerCase().includes(q)
        );
      }

      setThreats(list);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadThreats();
  }, [search, riskLevel, threatType, status, channel, page]);

  const columns: Column<ThreatRecord>[] = [
    {
      key: 'id',
      header: 'Threat ID',
      render: (item) => (
        <span className="font-mono text-xs font-bold text-rose-300 flex items-center gap-1.5">
          <Terminal size={12} className="text-slate-500" />
          {item.id}
        </span>
      ),
    },
    {
      key: 'threat_type',
      header: 'Threat Classification',
      render: (item) => (
        <span className="font-medium text-slate-200">{item.threat_type}</span>
      ),
    },
    {
      key: 'customer_name',
      header: 'Target / Customer',
      render: (item) => (
        <div>
          <span className="font-medium text-slate-200">{item.customer_name}</span>
          {item.conversation_id && (
            <span className="text-[10px] font-mono text-slate-500 block">{item.conversation_id}</span>
          )}
        </div>
      ),
    },
    {
      key: 'channel',
      header: 'Vector Channel',
      render: (item) => (
        <span className="text-xs font-mono uppercase text-slate-400">{item.channel}</span>
      ),
    },
    {
      key: 'risk_level',
      header: 'Assessed Risk',
      render: (item) => <RiskBadge level={item.risk_level} size="sm" />,
    },
    {
      key: 'social_engineering',
      header: 'Social Eng.',
      render: (item) => (
        <span
          className={`text-xs font-mono ${
            item.social_engineering ? 'text-amber-300 font-semibold' : 'text-slate-500'
          }`}
        >
          {item.social_engineering ? 'Confirmed' : 'None'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'IOC Status',
      render: (item) => (
        <span
          className={`text-[11px] font-mono px-2 py-0.5 rounded ${
            item.status === 'Active'
              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold'
              : item.status === 'Investigating'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: 'detected_at',
      header: 'Timestamp',
      render: (item) => <span className="text-[11px] font-mono text-slate-500">{item.detected_at}</span>,
    },
    {
      key: 'actions',
      header: 'Forensics',
      render: (item) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/threats/${item.id}`);
          }}
          className="p-1.5 rounded-lg bg-surface-elevated hover:bg-slate-800 text-slate-300 hover:text-white border border-surface-border transition-colors"
          title="Inspect threat"
        >
          <ArrowRight size={13} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-rose-400">
              ZERO-TRUST EDR TELEMETRY
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
            <ShieldAlert size={22} className="text-rose-400" />
            <span>Cyber Threat Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Forensic index of active credential phishing lures, brand impersonation attacks, lookalike domains, and rogue ingress channels.
          </p>
        </div>

        <button
          onClick={loadThreats}
          className="p-2.5 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-elevated text-slate-400 hover:text-slate-100 transition-all self-start sm:self-auto shadow-sm"
          title="Refresh threat directory"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border space-y-3 shadow-card">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder="Search by threat ID, vector name, or target..."
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={riskLevel}
              onChange={(e) => {
                setRiskLevel(e.target.value);
                setPage(1);
              }}
              className="bg-surface-elevated border border-surface-border hover:border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500/50 cursor-pointer font-sans"
            >
              <option value="">Risk Level (All)</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="bg-surface-elevated border border-surface-border hover:border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500/50 cursor-pointer font-sans"
            >
              <option value="">Status (All)</option>
              <option value="Active">Active</option>
              <option value="Investigating">Investigating</option>
              <option value="Mitigated">Mitigated</option>
            </select>

            <select
              value={channel}
              onChange={(e) => {
                setChannel(e.target.value);
                setPage(1);
              }}
              className="bg-surface-elevated border border-surface-border hover:border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500/50 cursor-pointer font-sans"
            >
              <option value="">Vector (All)</option>
              <option value="email">Email</option>
              <option value="chat">Chat</option>
              <option value="sms">SMS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Threats Table */}
      <DataTable
        columns={columns}
        data={threats}
        isLoading={isLoading}
        emptyTitle="No active threats in current scope"
        emptyDescription="All scanned support channels and attachments are clean in this sector."
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        onRowClick={(item) => navigate(`/threats/${item.id}`)}
      />
    </div>
  );
};
