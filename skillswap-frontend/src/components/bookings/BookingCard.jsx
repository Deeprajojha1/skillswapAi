import { Link } from 'react-router-dom';
import BookingStatus from './BookingStatus.jsx';

export default function BookingCard({ booking, creatorView = false }) {
  const href = creatorView ? `/creator/bookings/${booking.id}` : `/client/bookings/${booking.id}`;
  return (
    <article className="booking-card">
      <div>
        <BookingStatus status={booking.status} />
        <h3><Link to={href}>{booking.gig?.title}</Link></h3>
        <p>{booking.date} with {booking.gig?.creator}</p>
      </div>
      <strong>${booking.amount}</strong>
    </article>
  );
}
