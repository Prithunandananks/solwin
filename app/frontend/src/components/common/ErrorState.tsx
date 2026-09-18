import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  statusCode?: number | string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Please try again or check backend service connection.',
  statusCode,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-surface-card border border-rose-500/20 bg-rose-500/[0.03] rounded-2xl text-center my-6 shadow-card">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-sm">
        <AlertCircle size={22} />
      </div>
      {statusCode && (
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 mb-2">
          HTTP {statusCode}
        </span>
      )}
      <h3 className="text-base font-semibold text-slate-100 mb-1 font-sans">{title}</h3>
      <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-sm"
        >
          <RefreshCw size={13} />
          Retry Telemetry
        </button>
      )}
    </div>
  );
};
