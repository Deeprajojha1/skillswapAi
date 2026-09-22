import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import PaymentSummary from '../../components/payments/PaymentSummary.jsx';
import PayButton from '../../components/payments/PayButton.jsx';
import PaymentProcessing from '../../components/payments/PaymentProcessing.jsx';
import Button from '../../components/ui/Button.jsx';
import { PageLoader } from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { useBooking } from '../../features/bookings/bookingHooks.js';
import { BOOKING_STATUS, PAYMENT_STATUS, ROUTES } from '../../lib/constants.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [stage, setStage] = useState('idle');

  const { data: booking, isLoading, isError, error, refetch } = useBooking(bookingId);

  if (isLoading) return <PageLoader label="Loading booking…" />;

  if (isError) {
    return (
      <DashboardLayout title="Payment">
        <ErrorState title="Couldn't load this booking" message={getErrorMessage(error)} onRetry={refetch} />
      </DashboardLayout>
    );
  }

  const canPay = booking.status === BOOKING_STATUS.ACCEPTED && booking.paymentStatus === PAYMENT_STATUS.UNPAID;
  const alreadyPaid = booking.paymentStatus === PAYMENT_STATUS.PAID;

  return (
    <DashboardLayout title="Payment" description="Secure checkout for your accepted booking.">
      <div className="mx-auto max-w-lg space-y-5">
        <PaymentSummary booking={booking} />

        {stage === 'processing' || stage === 'success' || stage === 'failed' ? (
          <>
            <PaymentProcessing stage={stage} />
            {stage === 'success' ? (
              <Button fullWidth icon={ArrowRight} onClick={() => navigate(ROUTES.clientBookingDetails(bookingId))}>
                View booking
              </Button>
            ) : stage === 'failed' ? (
              <Button fullWidth variant="secondary" onClick={() => setStage('idle')}>
                Try again
              </Button>
            ) : null}
          </>
        ) : alreadyPaid ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
            <p className="text-sm font-semibold text-emerald-700">Payment completed</p>
            <Button className="mt-4" onClick={() => navigate(ROUTES.clientBookingDetails(bookingId))}>
              View booking
            </Button>
          </div>
        ) : canPay ? (
          <PayButton booking={booking} onStageChange={setStage} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-600">
            This booking isn&apos;t ready for payment yet. Payment is only available once a creator has accepted your
            request.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
