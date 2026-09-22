import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CalendarClock, FileText } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Image from '../../components/ui/Image.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import { PageLoader } from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import BookingStatus from '../../components/bookings/BookingStatus.jsx';
import BookingTimeline from '../../components/bookings/BookingTimeline.jsx';
import BookingActions from '../../components/bookings/BookingActions.jsx';
import PaymentStatus from '../../components/payments/PaymentStatus.jsx';
import { useBooking } from '../../features/bookings/bookingHooks.js';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate, formatDateTime } from '../../utils/formatDate.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

/**
 * Shared by both /client/bookings/:bookingId and /creator/bookings/:bookingId
 * — a booking is the same record from either side, just with different
 * permitted actions (handled entirely inside BookingActions). Keeping one
 * page avoids duplicating booking-detail rendering per role.
 */
export default function BookingDetails() {
  const { bookingId } = useParams();
  const user = useSelector(selectCurrentUser);
  const { data: booking, isLoading, isError, error, refetch } = useBooking(bookingId);

  if (isLoading) return <PageLoader label="Loading booking…" />;

  if (isError) {
    return (
      <DashboardLayout title="Booking Details">
        <ErrorState
          title="Couldn't load this booking"
          message={getErrorMessage(error, 'You may not have access to this booking.')}
          onRetry={refetch}
        />
      </DashboardLayout>
    );
  }

  const userId = user?._id || user?.id;
  const perspective = booking.creator?._id === userId || booking.creator?.id === userId ? 'creator' : 'client';
  const otherParty = perspective === 'creator' ? booking.client : booking.creator;

  return (
    <DashboardLayout title="Booking Details">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl sm:w-40">
                <Image src={booking.gig?.image?.url} alt={booking.gig?.title} className="h-28 w-full sm:w-40" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h1 className="text-lg font-bold text-slate-900">{booking.gig?.title}</h1>
                  <BookingStatus status={booking.status} />
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Avatar name={otherParty?.name} size="sm" />
                  <span>{otherParty?.name}</span>
                </div>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatCurrency(booking.priceSnapshot, booking.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">Progress</h2>
            <BookingTimeline booking={booking} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
              <FileText className="h-4 w-4 text-slate-400" /> Requirements
            </h2>
            <p className="whitespace-pre-line text-sm text-slate-600">{booking.requirements}</p>
            {booking.deadline ? (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarClock className="h-3.5 w-3.5" /> Deadline: {formatDate(booking.deadline)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Payment</h2>
            <PaymentStatus status={booking.paymentStatus} />
            <dl className="mt-3 space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <dt>Requested</dt>
                <dd>{formatDateTime(booking.createdAt)}</dd>
              </div>
              {booking.acceptedAt ? (
                <div className="flex justify-between">
                  <dt>Accepted</dt>
                  <dd>{formatDateTime(booking.acceptedAt)}</dd>
                </div>
              ) : null}
              {booking.completedAt ? (
                <div className="flex justify-between">
                  <dt>Completed</dt>
                  <dd>{formatDateTime(booking.completedAt)}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Actions</h2>
            <BookingActions booking={booking} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
