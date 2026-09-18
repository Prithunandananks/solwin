import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getThreats } from '../services/securityApi';
import { ThreatRecord, ThreatFilterParams } from '../types/security';
import { DataTable, Column } from '../components/common/DataTable';
import { RiskBadge } from '../components/common/RiskBadge';
import { FilterBar, FilterField } from '../components/common/FilterBar';
import { SearchBar } from '../components/common/SearchBar';
import { ShieldAlert, ShieldCheck, ArrowRight, AlertOctagon, Terminal } from 'lucide-react';

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
          <span className="font-medium text-slate-300">{item.customer_name}</span>
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
      header: 'Risk Level',
      render: (item) => <RiskBadge level={item.risk_level} size="sm" />,
    },
    {
      key: 'threat_detected',
      header: 'Detection Flag',
      render: (item) =>
        item.threat_detected ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-400">
            <ShieldAlert size={12} /> POSITIVE
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
            <ShieldCheck size={12} /> NEGATIVE
          </span>
        ),
    },
    {
      key: 'social_engineering',
      header: 'Social Eng.',
      render: (item) => (
        <span
          className={`text-xs font-medium ${
            item.social_engineering ? 'text-amber-400' : 'text-slate-500'
          }`}
        >
          {item.social_engineering ? 'Yes (Urgency / Impersonation)' : 'No'}
        </span>
      ),
    },
    {
      key: 'detected_at',
      header: 'Detection Time',
      render: (item) => (
        <span className="font-mono text-[11px] text-slate-400">{item.detected_at}</span>
      ),
    },
    {
      key: 'status',
      header: 'Incident Status',
      render: (item) => {
        let col = 'bg-surface-elevated text-slate-300 border-white/10';
        let dot = 'bg-slate-400';
        if (item.status === 'Active') {
          col = 'bg-rose-500/15 text-rose-300 border-rose-500/35 shadow-glow-danger';
          dot = 'bg-rose-500 animate-ping';
        } else if (item.status === 'Investigating') {
          col = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
          dot = 'bg-amber-400';
        } else if (item.status === 'Mitigated') {
          col = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
          dot = 'bg-emerald-400';
        }
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono border ${col}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            <span className="uppercase tracking-wider">{item.status}</span>
          </span>
        );
      },
    },
  ];

  const filterFields: FilterField[] = [
    {
      id: 'risk',
      label: 'Risk Level',
      value: riskLevel,
      options: [
        { label: 'Critical', value: 'CRITICAL' },
        { label: 'High', value: 'HIGH' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'Low', value: 'LOW' },
      ],
    },
    {
      id: 'threat_type',
      label: 'Threat Type',
      value: threatType,
      options: [
        { label: 'Spear Phishing', value: 'Spear Phishing' },
        { label: 'Credential Harvesting', value: 'Credential Harvesting' },
        { label: 'Wire Impersonation', value: 'Wire Impersonation' },
        { label: 'Account Takeover', value: 'Account Takeover' },
        { label: 'Suspicious Link', value: 'Suspicious Link' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      value: status,
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Investigating', value: 'Investigating' },
        { label: 'Mitigated', value: 'Mitigated' },
      ],
    },
    {
      id: 'channel',
      label: 'Channel',
      value: channel,
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Chat', value: 'chat' },
        { label: 'SMS', value: 'sms' },
        { label: 'Social', value: 'social' },
      ],
    },
  ];

  const handleFilterChange = (id: string, val: string) => {
    setPage(1);
    if (id === 'risk') setRiskLevel(val);
    if (id === 'threat_type') setThreatType(val);
    if (id === 'status') setStatus(val);
    if (id === 'channel') setChannel(val);
  };

  const handleResetFilters = () => {
    setRiskLevel('');
    setThreatType('');
    setStatus('');
    setChannel('');
    setSearch('');
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-rose-400">
              REAL-TIME IOC SURVEILLANCE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
            <ShieldAlert size={22} className="text-rose-400" />
            <span>SOC Threat Directory</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30">
              {total} Incidents
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Enterprise threat telemetry parsed from incoming customer channels, weaponized attachments, and automated IOC indicators.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-card/85 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 space-y-3 shadow-sm">
        <SearchBar
          placeholder="Filter by Threat ID (e.g. THR-2026-*), threat type, IOC, or target customer..."
          value={search}
          onChange={(q) => {
            setSearch(q);
            setPage(1);
          }}
          className="w-full"
        />

        <FilterBar
          filters={filterFields}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Threats Table */}
      <DataTable
        columns={columns}
        data={threats}
        isLoading={isLoading}
        emptyTitle="No threats detected"
        emptyDescription="No security threats match the selected filter criteria."
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRowClick={(item) => navigate(`/threats/${item.id}`)}
      />
    </div>
  );
};
