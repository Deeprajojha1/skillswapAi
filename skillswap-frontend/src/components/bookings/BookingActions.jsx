import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Ban, CheckCircle2, CreditCard, ThumbsDown, ThumbsUp } from 'lucide-react';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';
import { BOOKING_STATUS, PAYMENT_STATUS, ROUTES } from '../../lib/constants.js';
import Button from '../ui/Button.jsx';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import AcceptBookingModal from './AcceptBookingModal.jsx';
import DeclineBookingModal from './DeclineBookingModal.jsx';
import CancelBookingModal from './CancelBookingModal.jsx';
import { useCompleteBooking } from '../../features/bookings/bookingHooks.js';
import { toastError } from '../../services/toast.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

/**
 * The single place that decides which booking action buttons a viewer is
 * allowed to see, driven entirely by the booking's actual relationship to
 * the current user and its backend state (status / paymentStatus) — never
 * by the viewer's general account role alone. This mirrors the backend's
 * own transition guards in bookingState.service.js so the UI never offers
 * an action the API would reject.
 */
export default function BookingActions({ booking, size = 'md' }) {
  const user = useSelector(selectCurrentUser);
  const [activeModal, setActiveModal] = useState(null);
  const completeBooking = useCompleteBooking(booking._id);

  const userId = user?._id || user?.id;
  const isClient = booking.client?._id === userId || booking.client?.id === userId;
  const isCreator = booking.creator?._id === userId || booking.creator?.id === userId;

  const { status, paymentStatus } = booking;

  async function handleComplete() {
    try {
      await completeBooking.mutateAsync();
      setActiveModal(null);
    } catch (error) {
      toastError(getErrorMessage(error, "Couldn't complete this booking."));
    }
  }

  const buttons = [];

  if (isCreator && status === BOOKING_STATUS.PENDING) {
    buttons.push(
      <Button key="accept" size={size} icon={ThumbsUp} onClick={() => setActiveModal('accept')}>
        Accept
      </Button>,
      <Button key="decline" size={size} variant="danger" icon={ThumbsDown} onClick={() => setActiveModal('decline')}>
        Decline
      </Button>,
    );
  }

  if (isClient && status === BOOKING_STATUS.ACCEPTED && paymentStatus === PAYMENT_STATUS.UNPAID) {
    buttons.push(
      <Link key="pay" to={ROUTES.clientPay(booking._id)}>
        <Button size={size} icon={CreditCard}>
          Pay Now
        </Button>
      </Link>,
    );
  }

  if (isCreator && status === BOOKING_STATUS.ACCEPTED && paymentStatus === PAYMENT_STATUS.PAID) {
    buttons.push(
      <Button key="complete" size={size} icon={CheckCircle2} onClick={() => setActiveModal('complete')}>
        Mark as Completed
      </Button>,
    );
  }

  if ((isClient || isCreator) && status === BOOKING_STATUS.PENDING && isClient) {
    buttons.push(
      <Button key="cancel-pending" size={size} variant="secondary" icon={Ban} onClick={() => setActiveModal('cancel')}>
        Cancel Booking
      </Button>,
    );
  }

  if ((isClient || isCreator) && status === BOOKING_STATUS.ACCEPTED) {
    buttons.push(
      <Button key="cancel-accepted" size={size} variant="secondary" icon={Ban} onClick={() => setActiveModal('cancel')}>
        Cancel Booking
      </Button>,
    );
  }

  if (buttons.length === 0) {
    return (
      <p className="text-xs text-slate-400">
        {status === BOOKING_STATUS.COMPLETED
          ? 'This booking is complete. No further action is needed.'
          : status === BOOKING_STATUS.ACCEPTED
            ? 'Waiting for payment before this booking can be completed.'
            : 'No actions are available for this booking right now.'}
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">{buttons}</div>

      <AcceptBookingModal booking={booking} isOpen={activeModal === 'accept'} onClose={() => setActiveModal(null)} />
      <DeclineBookingModal booking={booking} isOpen={activeModal === 'decline'} onClose={() => setActiveModal(null)} />
      <CancelBookingModal booking={booking} isOpen={activeModal === 'cancel'} onClose={() => setActiveModal(null)} />
      <ConfirmDialog
        isOpen={activeModal === 'complete'}
        onClose={() => setActiveModal(null)}
        onConfirm={handleComplete}
        title="Mark this booking as completed?"
        description="Confirm that the work for this booking has been delivered."
        confirmLabel="Mark as Completed"
        confirmingLabel="Completing…"
        isConfirming={completeBooking.isPending}
      />
    </>
  );
}
