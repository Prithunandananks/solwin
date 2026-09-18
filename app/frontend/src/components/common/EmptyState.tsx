import React from 'react';
import { ShieldCheck, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = ShieldCheck,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-surface-card/60 border border-surface-border rounded-2xl text-center shadow-card backdrop-blur-sm">
      <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-surface-border flex items-center justify-center text-slate-400 mb-4 shadow-sm">
        <Icon size={24} className="stroke-[1.75]" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200 mb-1 font-sans">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-semibold transition-all shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
