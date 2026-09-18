import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse space-y-3 shadow-card"
        >
          <div className="flex justify-between items-center">
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="h-6 w-6 bg-slate-200 rounded" />
          </div>
          <div className="h-8 w-16 bg-slate-200 rounded" />
          <div className="h-3 w-32 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse space-y-4 shadow-card">
      <div className="h-10 bg-slate-100 rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-50 rounded" />
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse shadow-card">
      <div className="h-5 w-48 bg-slate-200 rounded mb-6" />
      <div className="h-64 bg-slate-50 rounded flex items-end justify-between p-6 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-slate-200 rounded-t"
            style={{ height: `${20 + (i * 12) % 60}%` }}
          />
        ))}
      </div>
    </div>
  );
};
