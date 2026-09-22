import BookingCard from '../../components/bookings/BookingCard.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useBookings } from '../../hooks/useBookings.js';

export default function MyBookings() {
  const { bookings, loading } = useBookings();
  return (
    <section className="page-section narrow">
      <p className="eyebrow">Client</p>
      <h1>My bookings</h1>
      {loading ? <Skeleton rows={2} /> : <div className="stack">{bookings.map((booking) => <BookingCard booking={booking} key={booking.id} />)}</div>}
    </section>
  );
}
