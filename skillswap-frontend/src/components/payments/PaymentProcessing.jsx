import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

const STAGE_CONFIG = {
  processing: {
    icon: Loader2,
    iconClassName: 'animate-spin text-indigo-600',
    bg: 'bg-indigo-50',
    title: 'Processing your payment…',
    description: 'Please don’t close this window.',
  },
  success: {
    icon: CheckCircle2,
    iconClassName: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Payment successful',
    description: 'Your booking has been marked as paid.',
  },
  failed: {
    icon: XCircle,
    iconClassName: 'text-rose-600',
    bg: 'bg-rose-50',
    title: 'Payment failed',
    description: 'Please try again, or use a different payment method.',
  },
};

/** Full-panel state shown during/after a payment attempt (section 26). */
export default function PaymentProcessing({ stage }) {
  const config = STAGE_CONFIG[stage];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center"
    >
      <span className={`flex h-16 w-16 items-center justify-center rounded-full ${config.bg}`}>
        <Icon className={`h-8 w-8 ${config.iconClassName}`} aria-hidden="true" />
      </span>
      <h2 className="text-base font-semibold text-slate-900">{config.title}</h2>
      <p className="max-w-xs text-sm text-slate-500">{config.description}</p>
    </motion.div>
  );
}
