import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className, id, required, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
        </label>
      ) : null}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          className={cn(
            'w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-9 text-sm text-slate-900',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
            error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500',
            className,
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;
