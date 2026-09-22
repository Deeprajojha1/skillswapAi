import apiClient from '../../services/apiClient.js';

// POST /api/payments/pay { bookingId }
// -> { paymentId, amount, currency, status, paidAt }
// Marks the booking paid directly — no external gateway round trip.
export async function payBooking(bookingId) {
  const { data } = await apiClient.post('/payments/pay', { bookingId });
  return data.data;
}
