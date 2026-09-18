import React from 'react';
import { PriorityLevel } from '../../types/conversation';

interface PriorityBadgeProps {
  priority: PriorityLevel | string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const norm = (priority || 'Low').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-500';

  if (norm === 'critical') {
    styles = 'bg-red-50 text-red-800 border-red-200 font-semibold';
    dotColor = 'bg-red-600';
  } else if (norm === 'high') {
    styles = 'bg-orange-50 text-orange-800 border-orange-200 font-semibold';
    dotColor = 'bg-orange-600';
  } else if (norm === 'medium') {
    styles = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-600';
  } else if (norm === 'low') {
    styles = 'bg-slate-50 text-slate-600 border-slate-200';
    dotColor = 'bg-slate-400';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono border font-medium ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`} />
      <span className="uppercase tracking-wider">{priority}</span>
    </span>
  );
};

