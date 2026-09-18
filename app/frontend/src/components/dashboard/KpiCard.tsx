import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: 'default' | 'danger' | 'warning' | 'info' | 'success';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon: Icon,
  subtext,
  trend,
  variant = 'default',
}) => {
  const variantStyles = {
    default: {
      border: 'border-surface-border hover:border-brand-cyan/40',
      iconBg: 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20',
      accentGlow: 'from-brand-cyan/20 via-transparent to-transparent',
    },
    danger: {
      border: 'border-rose-500/25 bg-rose-500/[0.02] hover:border-rose-500/50 shadow-glow-rose/20',
      iconBg: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      accentGlow: 'from-rose-500/30 via-transparent to-transparent',
    },
    warning: {
      border: 'border-amber-500/25 bg-amber-500/[0.02] hover:border-amber-500/50',
      iconBg: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      accentGlow: 'from-amber-500/25 via-transparent to-transparent',
    },
    info: {
      border: 'border-indigo-500/25 hover:border-indigo-500/50 shadow-glow-indigo/20',
      iconBg: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      accentGlow: 'from-indigo-500/25 via-transparent to-transparent',
    },
    success: {
      border: 'border-emerald-500/25 hover:border-emerald-500/50 shadow-glow-emerald/20',
      iconBg: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      accentGlow: 'from-emerald-500/25 via-transparent to-transparent',
    },
  }[variant];

  return (
    <div
      className={`relative overflow-hidden bg-surface-card/90 backdrop-blur-md border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group hover:shadow-card hover:-translate-y-0.5 ${variantStyles.border}`}
    >
      {/* Top subtle ambient gradient wash */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${variantStyles.accentGlow}`} />

      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors">
          {label}
        </span>
        <div className={`p-2 rounded-xl border ${variantStyles.iconBg} transition-transform group-hover:scale-110`}>
          <Icon size={17} />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans flex items-baseline gap-2">
          <span>{typeof value === 'number' ? value.toLocaleString() : value}</span>
        </div>

        {(subtext || trend) && (
          <div className="flex items-center gap-2 mt-2 text-xs">
            {trend && (
              <span
                className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-semibold ${
                  trend.isPositive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {trend.value}
              </span>
            )}
            {subtext && <span className="truncate text-slate-400 text-xs">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
