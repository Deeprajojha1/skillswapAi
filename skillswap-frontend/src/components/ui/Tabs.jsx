import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers.js';

/**
 * Accessible tab list used for booking status filters (All / Pending /
 * Accepted / …). `tabs` is `[{ value, label, count? }]`.
 */
export default function Tabs({ tabs, value, onChange, className }) {
  return (
    <div
      role="tablist"
      className={cn('flex gap-1 overflow-x-auto scrollbar-thin rounded-xl bg-slate-100 p-1', className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
              isActive ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-700',
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="tabs-active-pill"
                className="absolute inset-0 rounded-lg bg-white shadow-sm"
                transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              />
            ) : null}
            <span className="relative flex items-center gap-1.5">
              {tab.label}
              {typeof tab.count === 'number' ? (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600',
                  )}
                >
                  {tab.count}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
