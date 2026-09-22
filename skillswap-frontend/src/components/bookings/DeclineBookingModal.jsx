import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import Textarea from '../ui/Textarea.jsx';
import { declineBookingSchema } from '../../features/bookings/bookingSchemas.js';
import { useDeclineBooking } from '../../features/bookings/bookingHooks.js';
import { toastError } from '../../services/toast.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

export default function DeclineBookingModal({ booking, isOpen, onClose }) {
  const declineBooking = useDeclineBooking(booking?._id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(declineBookingSchema), defaultValues: { reason: '' } });

  async function onSubmit(values) {
    try {
      await declineBooking.mutateAsync(values.reason || undefined);
      reset();
      onClose();
    } catch (error) {
      toastError(getErrorMessage(error, "Couldn't decline this booking."));
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
      title="Decline this booking?"
      description="Let the client know why — this message is sent with the notification."
      confirmLabel="Decline Booking"
      confirmingLabel="Declining…"
      isConfirming={declineBooking.isPending}
      variant="danger"
    >
      <Textarea
        label="Reason (optional)"
        placeholder="e.g. Currently fully booked this week."
        rows={3}
        error={errors.reason?.message}
        {...register('reason')}
      />
    </ConfirmDialog>
  );
}
