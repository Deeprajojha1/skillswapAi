import { motion } from 'framer-motion';
import { Ban, Check, XCircle } from 'lucide-react';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../../lib/constants.js';
import { cn } from '../../utils/helpers.js';

const HAPPY_PATH = [
  { key: 'created', label: 'Requested' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'paid', label: 'Paid' },
  { key: 'completed', label: 'Completed' },
];

function getActiveStep(booking) {
  if (booking.status === BOOKING_STATUS.COMPLETED) return 3;
  if (booking.paymentStatus === PAYMENT_STATUS.PAID) return 2;
  if (booking.status === BOOKING_STATUS.ACCEPTED) return 1;
  return 0;
}

/** Visual step timeline for the booking state machine (section 19). Renders
 * an interrupted/terminal state (declined/cancelled) instead of the happy
 * path when applicable. */
export default function BookingTimeline({ booking }) {
  if (booking.status === BOOKING_STATUS.DECLINED) {
    return (
      <TerminalState icon={XCircle} tone="rose" label="Declined" reason={booking.declineReason || booking.reason} />
    );
  }

  if (booking.status === BOOKING_STATUS.CANCELLED) {
    return (
      <TerminalState icon={Ban} tone="slate" label="Cancelled" reason={booking.cancellationReason} />
    );
  }

  const activeStep = getActiveStep(booking);

  return (
    <ol className="flex items-center">
      {HAPPY_PATH.map((step, index) => {
        const isDone = index <= activeStep;
        const isLast = index === HAPPY_PATH.length - 1;
        return (
          <li key={step.key} className={cn('flex items-center', !isLast && 'flex-1')}>
            <div className="flex flex-col items-center gap-1.5">
              <motion.span
                initial={false}
                animate={{ scale: isDone ? 1 : 0.9, backgroundColor: isDone ? '#4f46e5' : '#e2e8f0' }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-white"
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : <span className="h-2 w-2 rounded-full bg-slate-400" />}
              </motion.span>
              <span className={cn('text-[11px] font-medium', isDone ? 'text-slate-900' : 'text-slate-400')}>
                {step.label}
              </span>
            </div>
            {!isLast ? (
              <div className="mx-1.5 h-0.5 flex-1 rounded-full bg-slate-200 sm:mx-2">
                <motion.div
                  initial={false}
                  animate={{ width: index < activeStep ? '100%' : '0%' }}
                  className="h-0.5 rounded-full bg-indigo-600"
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function TerminalState({ icon: Icon, tone, label, reason }) {
  const toneClasses = tone === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500';
  return (
    <div className={cn('flex items-center gap-3 rounded-xl p-3', toneClasses)}>
      <Icon className="h-5 w-5 shrink-0" />
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {reason ? <p className="text-xs opacity-80">{reason}</p> : null}
      </div>
    </div>
  );
}
