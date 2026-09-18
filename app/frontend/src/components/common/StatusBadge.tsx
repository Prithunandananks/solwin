import React from 'react';
import { ResolutionStatus } from '../../types/conversation';

interface StatusBadgeProps {
  status: ResolutionStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const norm = (status || 'Unresolved').toLowerCase();

  let styles = 'bg-surface-elevated text-slate-300 border-white/10';
  let dotColor = 'bg-slate-400';

  if (norm === 'resolved') {
    styles = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    dotColor = 'bg-emerald-400';
  } else if (norm === 'escalated') {
    styles = 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    dotColor = 'bg-purple-400';
  } else if (norm === 'pending') {
    styles = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    dotColor = 'bg-amber-400';
  } else if (norm === 'unresolved') {
    styles = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    dotColor = 'bg-rose-400';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="uppercase tracking-wider">{status}</span>
    </span>
  );
};

