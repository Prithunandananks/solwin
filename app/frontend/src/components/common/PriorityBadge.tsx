import React from 'react';
import { PriorityLevel } from '../../types/conversation';

interface PriorityBadgeProps {
  priority: PriorityLevel | string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const norm = (priority || 'Low').toLowerCase();

  let styles = 'bg-surface-elevated text-slate-300 border-white/10';
  let dotColor = 'bg-slate-400';

  if (norm === 'critical') {
    styles = 'bg-red-500/15 text-red-300 border-red-500/35 font-semibold';
    dotColor = 'bg-red-400';
  } else if (norm === 'high') {
    styles = 'bg-orange-500/15 text-orange-300 border-orange-500/35 font-semibold';
    dotColor = 'bg-orange-400';
  } else if (norm === 'medium') {
    styles = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    dotColor = 'bg-amber-400';
  } else if (norm === 'low') {
    styles = 'bg-slate-800/80 text-slate-400 border-white/10';
    dotColor = 'bg-slate-500';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`} />
      <span className="uppercase tracking-wider">{priority}</span>
    </span>
  );
};

