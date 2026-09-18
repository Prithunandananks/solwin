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
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-rose-200 rounded-xl text-center my-6 shadow-card">
      <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
        <AlertCircle size={24} />
      </div>
      {statusCode && (
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 mb-2">
          HTTP {statusCode}
        </span>
      )}
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <RefreshCw size={14} />
          Retry Request
        </button>
      )}
    </div>
  );
};
