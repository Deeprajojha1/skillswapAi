import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import { useAcceptBooking } from '../../features/bookings/bookingHooks.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { toastError } from '../../services/toast.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

export default function AcceptBookingModal({ booking, isOpen, onClose }) {
  const acceptBooking = useAcceptBooking(booking?._id);

  async function handleConfirm() {
    try {
      await acceptBooking.mutateAsync();
      onClose();
    } catch (error) {
      toastError(getErrorMessage(error, "Couldn't accept this booking."));
    }
  }

  if (!booking) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Accept this booking?"
      description="Accepting will automatically decline any other pending requests for this gig."
      confirmLabel="Accept Booking"
      confirmingLabel="Accepting…"
      isConfirming={acceptBooking.isPending}
    >
      <dl className="space-y-2 rounded-xl bg-slate-50 p-3.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Client</dt>
          <dd className="font-medium text-slate-900">{booking.client?.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Gig</dt>
          <dd className="max-w-[60%] truncate text-right font-medium text-slate-900">{booking.gig?.title}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Rate</dt>
          <dd className="font-medium text-slate-900">{formatCurrency(booking.priceSnapshot, booking.currency)}</dd>
        </div>
      </dl>
    </ConfirmDialog>
  );
}
