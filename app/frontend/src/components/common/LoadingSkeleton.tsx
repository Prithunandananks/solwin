import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface-card border border-surface-border rounded-2xl p-5 animate-pulse space-y-3 shadow-card"
        >
          <div className="flex justify-between items-center">
            <div className="h-3 w-24 bg-slate-800 rounded-md" />
            <div className="h-7 w-7 bg-slate-800 rounded-lg" />
          </div>
          <div className="h-8 w-20 bg-slate-800 rounded-md" />
          <div className="h-3 w-32 bg-slate-800/60 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-4 animate-pulse space-y-3 shadow-card">
      <div className="h-9 bg-slate-800 rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-800/40 rounded-lg" />
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-6 animate-pulse shadow-card">
      <div className="h-4 w-48 bg-slate-800 rounded mb-6" />
      <div className="h-64 bg-slate-900/50 rounded-xl flex items-end justify-between p-6 gap-2 border border-surface-border">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-slate-800/80 rounded-t"
            style={{ height: `${20 + (i * 12) % 60}%` }}
          />
        ))}
      </div>
    </div>
  );
};
