import React from 'react';
import { ResolutionStatus } from '../../types/conversation';

interface StatusBadgeProps {
  status: ResolutionStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const norm = (status || 'Unresolved').toLowerCase();

  let styles = 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80';
  let dotColor = 'bg-slate-400';

  if (norm === 'resolved') {
    styles = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30';
    dotColor = 'bg-emerald-500 dark:bg-emerald-400';
  } else if (norm === 'escalated') {
    styles = 'bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/35';
    dotColor = 'bg-violet-500 dark:bg-violet-400';
  } else if (norm === 'pending') {
    styles = 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/35';
    dotColor = 'bg-amber-500 dark:bg-amber-400';
  } else if (norm === 'unresolved') {
    styles = 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/35';
    dotColor = 'bg-rose-600 dark:bg-rose-400';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono border font-medium ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="uppercase tracking-wider">{status}</span>
    </span>
  );
};
