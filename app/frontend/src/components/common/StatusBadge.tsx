import React from 'react';
import { ResolutionStatus } from '../../types/conversation';

interface StatusBadgeProps {
  status: ResolutionStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const norm = (status || 'Unresolved').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-500';

  if (norm === 'resolved') {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-600';
  } else if (norm === 'escalated') {
    styles = 'bg-purple-50 text-purple-800 border-purple-200';
    dotColor = 'bg-purple-600';
  } else if (norm === 'pending') {
    styles = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-600';
  } else if (norm === 'unresolved') {
    styles = 'bg-rose-50 text-rose-800 border-rose-200';
    dotColor = 'bg-rose-600';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono border font-medium ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="uppercase tracking-wider">{status}</span>
    </span>
  );
};

