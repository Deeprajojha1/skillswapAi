import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers.js';

const TONES = {
  indigo: 'bg-indigo-50 text-indigo-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  slate: 'bg-slate-100 text-slate-600',
};

export default function StatCard({ label, value, icon: Icon, tone = 'indigo' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        {Icon ? (
          <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', TONES[tone])}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </motion.div>
  );
}
