import apiClient from '../../services/apiClient.js';

// POST /api/payments/create-order { bookingId }
// -> { paymentId, orderId, amount, currency, provider }
// NOTE: `amount` here is computed server-side from the booking's
// `priceSnapshot` — the frontend must never compute or display a price it
// invented itself for the actual charge.
export async function createPaymentOrder(bookingId) {
  const { data } = await apiClient.post('/payments/create-order', { bookingId });
  return data.data;
}

// POST /api/payments/verify { orderId, paymentId, signature }
export async function verifyPayment(payload) {
  const { data } = await apiClient.post('/payments/verify', payload);
  return data.data;
}
