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
        className="w-full pl-10 pr-12 py-2 bg-surface-card/90 border border-white/[0.08] hover:border-white/20 text-slate-100 placeholder-slate-500 rounded-xl text-xs focus:outline-none focus:border-brand-blue/70 focus:ring-2 focus:ring-brand-blue/20 transition-all font-sans shadow-inner"
      />
      {query ? (
        <button
          onClick={() => {
            setQuery('');
            onChange('');
          }}
          className="absolute right-3 text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          title="Clear search"
        >
          <X size={14} />
        </button>
      ) : (
        <div className="absolute right-3 hidden sm:flex items-center gap-0.5 pointer-events-none text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-surface-elevated border border-white/[0.06]">
          <Command size={10} />
          <span>K</span>
        </div>
      )}
    </div>
  );
};

