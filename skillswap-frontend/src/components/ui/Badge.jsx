import { cn } from '../../utils/helpers.js';

const TONES = {
  neutral: 'bg-slate-100 text-slate-700',
  brand: 'bg-indigo-100 text-indigo-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  info: 'bg-sky-100 text-sky-700',
};

/**
 * Generic pill badge. `GigStatusBadge` and `BookingStatus` both render
 * through this rather than re-implementing pill styling.
 */
export default function Badge({ children, tone = 'neutral', icon: Icon, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {Icon ? <Icon className="h-3 w-3" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
