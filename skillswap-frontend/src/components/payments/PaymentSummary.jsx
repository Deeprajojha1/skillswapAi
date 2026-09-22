import Image from '../ui/Image.jsx';
import Avatar from '../ui/Avatar.jsx';
import PaymentStatus from './PaymentStatus.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

/**
 * Booking + amount summary for the payment page. The amount always comes
 * from `booking.priceSnapshot` (a value the backend recorded at booking
 * time) — never recomputed on the client.
 */
export default function PaymentSummary({ booking }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex gap-4">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg">
          <Image src={booking.gig?.image?.url} alt={booking.gig?.title} className="h-20 w-28" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-900">{booking.gig?.title}</h2>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <Avatar name={booking.creator?.name} size="xs" />
            {booking.creator?.name}
          </div>
          <div className="mt-2">
            <PaymentStatus status={booking.paymentStatus} />
          </div>
        </div>
      </div>

      <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Booking amount</dt>
          <dd className="font-medium text-slate-900">{formatCurrency(booking.priceSnapshot, booking.currency)}</dd>
        </div>
        <div className="flex justify-between text-base font-bold text-slate-900">
          <dt>Total</dt>
          <dd>{formatCurrency(booking.priceSnapshot, booking.currency)}</dd>
        </div>
      </dl>
    </div>
  );
}
