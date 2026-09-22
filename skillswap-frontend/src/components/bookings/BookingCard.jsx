import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import Image from '../ui/Image.jsx';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import BookingStatus from './BookingStatus.jsx';
import BookingActions from './BookingActions.jsx';
import { BOOKING_STATUS, PAYMENT_STATUS, ROUTES } from '../../lib/constants.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import { truncate } from '../../utils/helpers.js';

export default function BookingCard({ booking, perspective = 'client' }) {
  const otherParty = perspective === 'client' ? booking.creator : booking.client;
  const detailsRoute =
    perspective === 'client' ? ROUTES.clientBookingDetails(booking._id) : ROUTES.creatorBookingDetails(booking._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link to={detailsRoute} className="h-24 w-full shrink-0 overflow-hidden rounded-xl sm:w-32">
          <Image src={booking.gig?.image?.url} alt={booking.gig?.title} className="h-24 w-full sm:w-32" />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <Link to={detailsRoute} className="truncate text-sm font-semibold text-slate-900 hover:text-indigo-700">
                {booking.gig?.title || 'Gig unavailable'}
              </Link>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <Avatar name={otherParty?.name} size="xs" />
                <span>{otherParty?.name}</span>
              </div>
            </div>
            <BookingStatus status={booking.status} />
          </div>

          <p className="mt-2 line-clamp-2 text-xs text-slate-500">{truncate(booking.requirements, 160)}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">
              {formatCurrency(booking.priceSnapshot, booking.currency)}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" /> {formatDate(booking.createdAt)}
            </span>
            {booking.status === BOOKING_STATUS.ACCEPTED && booking.paymentStatus === PAYMENT_STATUS.PAID ? (
              <Badge tone="success">Payment completed</Badge>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <BookingActions booking={booking} size="sm" />
            <Link
              to={detailsRoute}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              Details <ArrowRight className="h-3 w-3" />
            </Link>
            {booking.status === BOOKING_STATUS.DECLINED && booking.gig?._id ? (
              <Link
                to={ROUTES.gigDetails(booking.gig._id)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Browse Similar <ArrowRight className="h-3 w-3" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
