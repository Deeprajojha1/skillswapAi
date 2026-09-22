import {
  AlertTriangle,
  BadgeCheck,
  Ban,
  CalendarPlus,
  CheckCircle2,
  PartyPopper,
  Receipt,
  XCircle,
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate.js';
import { cn } from '../../utils/helpers.js';

const ICON_BY_TYPE = {
  'booking.created': { icon: CalendarPlus, tone: 'text-indigo-600 bg-indigo-50' },
  'booking.accepted': { icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-50' },
  'booking.declined': { icon: XCircle, tone: 'text-rose-600 bg-rose-50' },
  'booking.cancelled': { icon: Ban, tone: 'text-slate-500 bg-slate-100' },
  'booking.completed': { icon: PartyPopper, tone: 'text-emerald-600 bg-emerald-50' },
  'payment.created': { icon: Receipt, tone: 'text-sky-600 bg-sky-50' },
  'payment.success': { icon: BadgeCheck, tone: 'text-emerald-600 bg-emerald-50' },
  'payment.failed': { icon: AlertTriangle, tone: 'text-rose-600 bg-rose-50' },
};

export default function NotificationItem({ notification, onClick }) {
  const config = ICON_BY_TYPE[notification.type] || { icon: CalendarPlus, tone: 'text-slate-500 bg-slate-100' };
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => onClick?.(notification)}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50',
        !notification.isRead && 'bg-indigo-50/40',
      )}
    >
      <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', config.tone)}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-slate-900">{notification.title}</span>
          {!notification.isRead ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" /> : null}
        </span>
        <span className="mt-0.5 line-clamp-2 block text-xs text-slate-500">{notification.message}</span>
        <span className="mt-1 block text-[11px] text-slate-400">{formatRelativeTime(notification.createdAt)}</span>
      </span>
    </button>
  );
}
