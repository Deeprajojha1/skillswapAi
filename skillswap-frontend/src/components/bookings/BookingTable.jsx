import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar.jsx';
import BookingStatus from './BookingStatus.jsx';
import BookingActions from './BookingActions.jsx';
import { ROUTES } from '../../lib/constants.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

/**
 * Desktop table presentation of a booking list (section 39: "desktop:
 * table/card hybrid, mobile: cards"). `BookingCard` handles the mobile view
 * for the exact same data — both render through `BookingStatus` /
 * `BookingActions` so status and action logic is never duplicated.
 */
export default function BookingTable({ bookings, perspective = 'client' }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white lg:block">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Gig</th>
            <th className="px-4 py-3 font-medium">{perspective === 'client' ? 'Creator' : 'Client'}</th>
            <th className="px-4 py-3 font-medium">Rate</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {bookings.map((booking) => {
            const otherParty = perspective === 'client' ? booking.creator : booking.client;
            const detailsRoute =
              perspective === 'client'
                ? ROUTES.clientBookingDetails(booking._id)
                : ROUTES.creatorBookingDetails(booking._id);
            return (
              <tr key={booking._id} className="hover:bg-slate-50/60">
                <td className="max-w-[220px] truncate px-4 py-3">
                  <Link to={detailsRoute} className="font-medium text-slate-900 hover:text-indigo-700">
                    {booking.gig?.title || 'Gig unavailable'}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={otherParty?.name} size="xs" />
                    <span className="truncate text-slate-600">{otherParty?.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {formatCurrency(booking.priceSnapshot, booking.currency)}
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(booking.createdAt)}</td>
                <td className="px-4 py-3">
                  <BookingStatus status={booking.status} />
                </td>
                <td className="px-4 py-3">
                  <BookingActions booking={booking} size="sm" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
