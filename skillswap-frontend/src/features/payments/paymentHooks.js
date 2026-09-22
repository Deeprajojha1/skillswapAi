import { useMutation, useQueryClient } from '@tanstack/react-query';
import { payBooking } from './paymentApi.js';
import { QUERY_KEYS } from '../../lib/constants.js';
import { toastError, toastSuccess } from '../../services/toast.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

// The backend exposes no standalone "get payment status" endpoint — the
// booking document itself carries `paymentStatus` (unpaid/paid/failed/
// refunded), which is why the mutation below invalidates the booking query
// as its source of truth for payment state.

export function usePayBooking(bookingId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => payBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.booking(bookingId) });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      toastSuccess('Payment successful.');
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.booking(bookingId) });
      toastError(getErrorMessage(error, 'Payment failed. Please try again.'));
    },
  });
}
