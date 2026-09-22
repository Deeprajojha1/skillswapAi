import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import Textarea from '../ui/Textarea.jsx';
import { cancelBookingSchema } from '../../features/bookings/bookingSchemas.js';
import { useCancelBooking } from '../../features/bookings/bookingHooks.js';
import { toastError } from '../../services/toast.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

export default function CancelBookingModal({ booking, isOpen, onClose }) {
  const cancelBooking = useCancelBooking(booking?._id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(cancelBookingSchema), defaultValues: { reason: '' } });

  async function onSubmit(values) {
    try {
      await cancelBooking.mutateAsync(values.reason || undefined);
      reset();
      onClose();
    } catch (error) {
      toastError(getErrorMessage(error, "Couldn't cancel this booking."));
    }
  }

  if (!booking) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      onConfirm={handleSubmit(onSubmit)}
      title="Cancel this booking?"
      description="This cannot be undone. The other party will be notified."
      confirmLabel="Cancel Booking"
      confirmingLabel="Cancelling…"
      isConfirming={cancelBooking.isPending}
      variant="danger"
    >
      <Textarea
        label="Reason (optional)"
        placeholder="e.g. Schedule conflict."
        rows={3}
        error={errors.reason?.message}
        {...register('reason')}
      />
    </ConfirmDialog>
  );
}
