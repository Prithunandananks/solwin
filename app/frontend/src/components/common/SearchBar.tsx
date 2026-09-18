import React, { useState, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search telemetry, entities, tickets...',
  value: initialValue = '',
  onChange,
  debounceMs = 300,
  className = '',
}) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs, onChange]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3.5 text-slate-500 pointer-events-none transition-colors group-focus-within:text-brand-cyan" size={15} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-12 py-2 bg-surface-card border border-surface-border hover:border-slate-700 text-slate-200 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-brand-cyan/60 focus:ring-1 focus:ring-brand-cyan/40 transition-all font-sans shadow-sm"
      />
      {query ? (
        <button
          onClick={() => {
            setQuery('');
            onChange('');
          }}
          className="absolute right-3 text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
          title="Clear search"
        >
          <X size={14} />
        </button>
      ) : (
        <div className="absolute right-3 hidden sm:flex items-center gap-0.5 pointer-events-none text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-surface-elevated border border-surface-border">
          <Command size={10} />
          <span>K</span>
        </div>
      )}
    </div>
  );
};
