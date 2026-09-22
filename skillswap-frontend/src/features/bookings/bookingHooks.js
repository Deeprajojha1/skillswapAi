import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptBooking,
  cancelBooking,
  completeBooking,
  createBooking,
  declineBooking,
  fetchBooking,
  fetchIncomingBookings,
  fetchMyBookings,
} from './bookingApi.js';
import { QUERY_KEYS } from '../../lib/constants.js';
import { toastSuccess } from '../../services/toast.js';

// The backend returns every booking for the caller in one shot (no status
// filter param) — status-tab filtering happens client-side in the page.
export function useMyBookings() {
  return useQuery({
    queryKey: QUERY_KEYS.myBookings({}),
    queryFn: fetchMyBookings,
  });
}

export function useIncomingBookings() {
  return useQuery({
    queryKey: QUERY_KEYS.incomingBookings({}),
    queryFn: fetchIncomingBookings,
  });
}

export function useBooking(bookingId) {
  return useQuery({
    queryKey: QUERY_KEYS.booking(bookingId),
    queryFn: () => fetchBooking(bookingId),
    enabled: Boolean(bookingId),
  });
}

function invalidateBookingLists(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['myBookings'] });
  queryClient.invalidateQueries({ queryKey: ['incomingBookings'] });
  // Accepting/cancelling a booking flips the underlying gig's status
  // (active <-> booked), so the marketplace list can go stale too.
  queryClient.invalidateQueries({ queryKey: ['gigs'] });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (booking) => {
      invalidateBookingLists(queryClient);
      queryClient.setQueryData(QUERY_KEYS.booking(booking._id), booking);
      toastSuccess('Booking request sent successfully.');
    },
  });
}

export function useAcceptBooking(bookingId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => acceptBooking(bookingId),
    onSuccess: (booking) => {
      invalidateBookingLists(queryClient);
      queryClient.setQueryData(QUERY_KEYS.booking(bookingId), booking);
      toastSuccess('Booking accepted.');
    },
  });
}

export function useDeclineBooking(bookingId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason) => declineBooking(bookingId, reason),
    onSuccess: (booking) => {
      invalidateBookingLists(queryClient);
      queryClient.setQueryData(QUERY_KEYS.booking(bookingId), booking);
      toastSuccess('Booking declined.');
    },
  });
}

export function useCancelBooking(bookingId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason) => cancelBooking(bookingId, reason),
    onSuccess: (booking) => {
      invalidateBookingLists(queryClient);
      queryClient.setQueryData(QUERY_KEYS.booking(bookingId), booking);
      toastSuccess('Booking cancelled.');
    },
  });
}

export function useCompleteBooking(bookingId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => completeBooking(bookingId),
    onSuccess: (booking) => {
      invalidateBookingLists(queryClient);
      queryClient.setQueryData(QUERY_KEYS.booking(bookingId), booking);
      toastSuccess('Booking marked as completed.');
    },
  });
}
