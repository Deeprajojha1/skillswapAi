import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { GIGS } from '../utils/constants.js';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBookings().then((items) => {
      setBookings(items.map((booking) => ({ ...booking, gig: GIGS.find((gig) => gig.id === booking.gigId) })));
      setLoading(false);
    });
  }, []);

  return { bookings, loading };
}
