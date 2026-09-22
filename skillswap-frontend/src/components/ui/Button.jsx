import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers.js';
import { ButtonSpinner } from './Spinner.jsx';

const VARIANTS = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600 shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  outline: 'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-5 py-3 gap-2',
};

/**
 * The single Button implementation for the whole app — every primary,
 * secondary, and danger action button renders through this component so
 * loading/disabled behavior stays consistent everywhere.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText,
    disabled = false,
    fullWidth = false,
    type = 'button',
    icon: Icon,
    className,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <ButtonSpinner />
          <span>{loadingText || 'Please wait…'}</span>
        </>
      ) : (
        <>
          {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
          {children}
        </>
      )}
    </motion.button>
  );
});

export default Button;
