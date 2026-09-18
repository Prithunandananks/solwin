import React from 'react';
import { SentimentType } from '../../types/conversation';
import { Smile, Meh, Frown } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment: SentimentType | string;
  showIcon?: boolean;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment, showIcon = true }) => {
  const norm = (sentiment || 'Neutral').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = Meh;

  if (norm === 'positive') {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    Icon = Smile;
  } else if (norm === 'negative') {
    styles = 'bg-rose-50 text-rose-800 border-rose-200';
    Icon = Frown;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-mono border font-medium ${styles}`}>
      {showIcon && <Icon size={12} className="shrink-0" />}
      <span className="uppercase tracking-wide">{sentiment}</span>
    </span>
  );
};

