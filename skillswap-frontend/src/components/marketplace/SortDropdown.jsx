import { ArrowUpDown, Check } from 'lucide-react';
import Dropdown from '../ui/Dropdown.jsx';
import { SORT_OPTIONS } from '../../lib/constants.js';
import { cn } from '../../utils/helpers.js';

export default function SortDropdown({ value, onChange }) {
  const current = SORT_OPTIONS.find((o) => o.value === value) || SORT_OPTIONS[0];

  return (
    <Dropdown
      align="right"
      trigger={
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <span className="hidden sm:inline">{current.label}</span>
        </button>
      }
      panelClassName="w-52 py-1.5"
    >
      {SORT_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'flex w-full items-center justify-between px-3.5 py-2 text-left text-sm hover:bg-slate-50',
            option.value === value ? 'text-indigo-700 font-medium' : 'text-slate-600',
          )}
        >
          {option.label}
          {option.value === value ? <Check className="h-4 w-4" /> : null}
        </button>
      ))}
    </Dropdown>
  );
}
