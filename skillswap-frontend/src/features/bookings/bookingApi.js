import apiClient from '../../services/apiClient.js';

// GET /api/bookings/my — client's own bookings (all statuses)
export async function fetchMyBookings() {
  const { data } = await apiClient.get('/bookings/my');
  return data.data;
}

// GET /api/bookings/incoming — bookings made against the creator's gigs
export async function fetchIncomingBookings() {
  const { data } = await apiClient.get('/bookings/incoming');
  return data.data;
}

// GET /api/bookings/:id
export async function fetchBooking(bookingId) {
  const { data } = await apiClient.get(`/bookings/${bookingId}`);
  return data.data;
}

// POST /api/bookings { gigId, requirements, deadline? }
export async function createBooking(payload) {
  const { data } = await apiClient.post('/bookings', payload);
  return data.data;
}

// PATCH /api/bookings/:id/accept
export async function acceptBooking(bookingId) {
  const { data } = await apiClient.patch(`/bookings/${bookingId}/accept`);
  return data.data;
}

// PATCH /api/bookings/:id/decline { reason }
export async function declineBooking(bookingId, reason) {
  const { data } = await apiClient.patch(`/bookings/${bookingId}/decline`, { reason });
  return data.data;
}

// PATCH /api/bookings/:id/cancel { reason }
export async function cancelBooking(bookingId, reason) {
  const { data } = await apiClient.patch(`/bookings/${bookingId}/cancel`, { reason });
  return data.data;
}

// PATCH /api/bookings/:id/complete
export async function completeBooking(bookingId) {
  const { data } = await apiClient.patch(`/bookings/${bookingId}/complete`);
  return data.data;
}
