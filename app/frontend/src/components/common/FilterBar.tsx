import React from 'react';
import { Filter } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
}

interface FilterBarProps {
  filters: FilterField[];
  onChange: (id: string, value: string) => void;
  onReset?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange, onReset }) => {
  const hasActiveFilters = filters.some((f) => f.value !== '');

  return (
    <div className="flex flex-wrap items-center gap-2.5 py-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-1">
        <Filter size={14} className="text-slate-700" />
        <span>Filters:</span>
      </div>

      {filters.map((filter) => (
        <div key={filter.id} className="relative">
          <select
            value={filter.value}
            onChange={(e) => onChange(filter.id, e.target.value)}
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors cursor-pointer shadow-sm"
          >
            <option value="">{filter.label} (All)</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {hasActiveFilters && onReset && (
        <button
          onClick={onReset}
          className="text-xs text-slate-700 hover:text-slate-900 px-2 py-1 rounded transition-colors font-medium underline underline-offset-2"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
