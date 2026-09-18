import React from 'react';
import { SentimentType } from '../../types/conversation';
import { Smile, Meh, Frown } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment: SentimentType | string;
  showIcon?: boolean;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment, showIcon = true }) => {
  const norm = (sentiment || 'Neutral').toLowerCase();

  let styles = 'bg-surface-elevated text-slate-300 border-white/10';
  let Icon = Meh;

  if (norm === 'positive') {
    styles = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
    Icon = Smile;
  } else if (norm === 'negative') {
    styles = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    Icon = Frown;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-mono border backdrop-blur-sm ${styles}`}>
      {showIcon && <Icon size={12} className="shrink-0" />}
      <span className="uppercase tracking-wide">{sentiment}</span>
    </span>
  );
};

