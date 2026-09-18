import React from 'react';
import { ResolutionStatus } from '../../types/conversation';

interface StatusBadgeProps {
  status: ResolutionStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const norm = (status || 'Unresolved').toLowerCase();

  let styles = 'bg-slate-800/80 text-slate-300 border-slate-700/80';
  let dotColor = 'bg-slate-400';

  if (norm === 'resolved') {
    styles = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    dotColor = 'bg-emerald-400';
  } else if (norm === 'escalated') {
    styles = 'bg-violet-500/15 text-violet-300 border-violet-500/35';
    dotColor = 'bg-violet-400';
  } else if (norm === 'pending') {
    styles = 'bg-amber-500/15 text-amber-300 border-amber-500/35';
    dotColor = 'bg-amber-400';
  } else if (norm === 'unresolved') {
    styles = 'bg-rose-500/15 text-rose-300 border-rose-500/35';
    dotColor = 'bg-rose-400';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono border font-medium ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="uppercase tracking-wider">{status}</span>
    </span>
  );
};
