import React from 'react';
import { PriorityLevel } from '../../types/conversation';

interface PriorityBadgeProps {
  priority: PriorityLevel | string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const norm = (priority || 'Low').toLowerCase();

  let styles = 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80';
  let dotColor = 'bg-slate-400';

  if (norm === 'critical') {
    styles = 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/40 font-semibold';
    dotColor = 'bg-rose-600 dark:bg-rose-400 animate-ping';
  } else if (norm === 'high') {
    styles = 'bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/35 font-semibold';
    dotColor = 'bg-orange-500 dark:bg-orange-400';
  } else if (norm === 'medium') {
    styles = 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/35';
    dotColor = 'bg-amber-500 dark:bg-amber-400';
  } else if (norm === 'low') {
    styles = 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60';
    dotColor = 'bg-slate-400 dark:bg-slate-500';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono border font-medium ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`} />
      <span className="uppercase tracking-wider">{priority}</span>
    </span>
  );
};
