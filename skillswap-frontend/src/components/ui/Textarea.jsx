import { forwardRef, useId } from 'react';
import { cn } from '../../utils/helpers.js';

const Textarea = forwardRef(function Textarea(
  { label, error, hint, className, id, required, rows = 4, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
        className={cn(
          'w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
          error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500',
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={`${textareaId}-error`} className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${textareaId}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Textarea;
