import BookingCard from '../bookings/BookingCard.jsx';

// Thin, intentional wrapper: an "incoming booking" is just a booking viewed
// from the creator's perspective, so this reuses BookingCard entirely
// instead of re-implementing card/status/action rendering a second time.
export default function IncomingBookingCard({ booking }) {
  return <BookingCard booking={booking} perspective="creator" />;
}
