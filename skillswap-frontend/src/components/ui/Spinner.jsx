import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

/** Base spinner; every other loading indicator in the app composes this. */
export function Spinner({ className, size = 20 }) {
  return (
    <Loader2
      className={cn('animate-spin text-current', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

/** Small spinner meant to sit inline inside a <Button isLoading />. */
export function ButtonSpinner() {
  return <Spinner size={16} className="text-current" />;
}

/** Tiny spinner for inline text, e.g. "Searching...". */
export function InlineSpinner({ className }) {
  return <Spinner size={14} className={cn('text-indigo-600', className)} />;
}

/** Centered spinner for a section/page that is loading its main content. */
export function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Spinner size={32} className="text-indigo-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

/** Full-viewport loader used only for the initial app bootstrap and route loading. */
export function FullScreenLoader({ label = 'Loading SkillSwap...' }) {
  return (
    <div className="fixed inset-0 z-50 grid min-h-screen place-items-center bg-white/90 px-4 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <Spinner size={40} className="text-indigo-600" />
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
    </div>
  );
}
