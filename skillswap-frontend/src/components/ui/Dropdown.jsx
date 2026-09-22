import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/helpers.js';

/**
 * Generic trigger + floating panel dropdown. Powers the user menu, the sort
 * dropdown, and the notification bell dropdown — all three compose this
 * instead of hand-rolling their own open/close/outside-click logic.
 */
export default function Dropdown({ trigger, children, align = 'right', open, onOpenChange, panelClassName }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = (value) => (isControlled ? onOpenChange?.(value) : setInternalOpen(value));
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div onClick={() => setOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-40 mt-2 rounded-xl border border-slate-200 bg-white shadow-lg',
              align === 'right' ? 'right-0' : 'left-0',
              panelClassName,
            )}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
