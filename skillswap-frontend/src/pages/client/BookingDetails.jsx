import { useParams } from 'react-router-dom';
import BookingTimeline from '../../components/bookings/BookingTimeline.jsx';
import BookingStatus from '../../components/bookings/BookingStatus.jsx';
import { BOOKINGS, GIGS } from '../../utils/constants.js';

export default function BookingDetails() {
  const { bookingId } = useParams();
  const booking = BOOKINGS.find((item) => item.id === bookingId) ?? BOOKINGS[0];
  const gig = GIGS.find((item) => item.id === booking.gigId);
  return (
    <section className="page-section narrow">
      <BookingStatus status={booking.status} />
      <h1>{gig.title}</h1>
      <p className="lead">Scheduled for {booking.date}. Total: ${booking.amount}.</p>
      <BookingTimeline current={booking.status === 'in-progress' ? 2 : 1} />
    </section>
  );
}
