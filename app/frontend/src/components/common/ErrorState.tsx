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
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/40 border border-red-900/30 rounded-xl text-center my-6">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
        <AlertCircle size={24} />
      </div>
      {statusCode && (
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/40 mb-2">
          HTTP {statusCode}
        </span>
      )}
      <h3 className="text-lg font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700"
        >
          <RefreshCw size={14} />
          Retry Request
        </button>
      )}
    </div>
  );
};
