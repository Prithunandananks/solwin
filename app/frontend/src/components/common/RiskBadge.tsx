import React from 'react';
import { RiskLevel } from '../../types/conversation';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel | string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, showIcon = true, size = 'md' }) => {
  const norm = (level || 'LOW').toUpperCase();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] font-medium font-mono',
    md: 'px-2.5 py-1 text-xs font-medium font-mono',
    lg: 'px-3 py-1.5 text-xs font-semibold font-mono',
  }[size];

  const iconSizes = {
    sm: 11,
    md: 13,
    lg: 14,
  }[size];

  let colorClasses = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
  let dotColor = 'bg-emerald-500 dark:bg-emerald-400';
  let Icon = ShieldCheck;
  let label = 'LOW RISK';

  if (norm === 'CRITICAL') {
    colorClasses = 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/40 shadow-sm dark:shadow-glow-rose';
    dotColor = 'bg-rose-600 dark:bg-rose-400';
    Icon = ShieldAlert;
    label = 'CRITICAL RISK';
  } else if (norm === 'HIGH') {
    colorClasses = 'bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/35';
    dotColor = 'bg-orange-500 dark:bg-orange-400';
    Icon = AlertTriangle;
    label = 'HIGH RISK';
  } else if (norm === 'MEDIUM') {
    colorClasses = 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/35';
    dotColor = 'bg-amber-500 dark:bg-amber-400';
    Icon = AlertTriangle;
    label = 'MEDIUM RISK';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all ${sizeClasses} ${colorClasses}`}
    >
      {norm === 'CRITICAL' ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-400"></span>
        </span>
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      )}
      {showIcon && <Icon size={iconSizes} className="shrink-0" />}
      <span className="tracking-wider">{label}</span>
    </span>
  );
};
