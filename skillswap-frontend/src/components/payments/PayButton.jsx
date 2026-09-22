import { Wallet } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { usePayBooking } from '../../features/payments/paymentHooks.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

/**
 * Direct pay: one click marks the booking as paid (POST /payments/pay).
 * No gateway, no order/verify round trip — the backend flips the booking's
 * paymentStatus straight to "paid" and fires the payment notification.
 */
export default function PayButton({ booking, onStageChange }) {
  const payBooking = usePayBooking(booking._id);

  async function handlePay() {
    try {
      onStageChange?.('processing');
      await payBooking.mutateAsync();
      onStageChange?.('success');
    } catch {
      onStageChange?.('failed');
    }
  }

  return (
    <Button
      fullWidth
      size="lg"
      icon={Wallet}
      isLoading={payBooking.isPending}
      loadingText="Processing payment…"
      onClick={handlePay}
    >
      Pay {formatCurrency(booking.priceSnapshot, booking.currency)}
    </Button>
  );
}
