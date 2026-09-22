import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import Button from './Button.jsx';
import { cn } from '../../utils/helpers.js';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  actionTo,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description ? <p className="max-w-sm text-sm text-slate-500">{description}</p> : null}
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          {actionLabel}
        </Link>
      ) : actionLabel && onAction ? (
        <div className="pt-2">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </motion.div>
  );
}
