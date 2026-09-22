import { cloneElement, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/helpers.js';

export default function Tooltip({ label, children, side = 'top', className }) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  const sideClasses = {
    top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
    bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  };

  const trigger = cloneElement(children, {
    'aria-describedby': tooltipId,
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false),
    onFocus: () => setVisible(true),
    onBlur: () => setVisible(false),
  });

  return (
    <span className="relative inline-flex">
      {trigger}
      <AnimatePresence>
        {visible ? (
          <motion.span
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, y: side === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className={cn(
              'pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white',
              sideClasses[side],
              className,
            )}
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
