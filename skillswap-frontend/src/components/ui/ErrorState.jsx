import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import Button from './Button.jsx';
import { cn } from '../../utils/helpers.js';

/**
 * Generic "something failed" panel used for every failed query in the app.
 * Pass the normalized error's `.message` (see getErrorMessage) — never a
 * raw error object.
 */
export default function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load this. Please try again.",
  onRetry,
  isNetworkError = false,
  className,
}) {
  const Icon = isNetworkError ? WifiOff : AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/60 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-500">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
      {onRetry ? (
        <div className="pt-2">
          <Button variant="secondary" icon={RefreshCw} onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
    </motion.div>
  );
}
