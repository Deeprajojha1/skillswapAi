import { Wallet } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { useCreatePaymentOrder, useVerifyPayment } from '../../features/payments/paymentHooks.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

/**
 * Simulates the "user completes checkout" step of a real payment provider,
 * then verifies it against the backend exactly like a real provider
 * callback would (POST /payments/verify). The backend's mock provider only
 * accepts the literal signature "mock_valid_signature" — see
 * skillswap-backend/src/services/payment/mock.provider.js — which is why
 * that value is hard-coded here rather than genuinely computed.
 *
 * To switch to Razorpay: set VITE_PAYMENT_PROVIDER=razorpay, set the backend
 * PAYMENT_PROVIDER env var the same way, and swap this component for one
 * that opens the Razorpay Checkout widget and forwards its real
 * `razorpay_payment_id` / signature into the same `useVerifyPayment` hook —
 * `createOrder`/`verify` call shapes do not need to change.
 */
export default function MockPaymentButton({ booking, onStageChange }) {
  const createOrder = useCreatePaymentOrder(booking._id);
  const verifyPayment = useVerifyPayment(booking._id);

  const isProcessing = createOrder.isPending || verifyPayment.isPending;

  async function handlePay() {
    try {
      onStageChange?.('processing');
      const order = await createOrder.mutateAsync();
      // Simulate the provider's checkout callback.
      await new Promise((resolve) => setTimeout(resolve, 900));
      await verifyPayment.mutateAsync({
        orderId: order.orderId,
        paymentId: `mock_pay_${order.orderId.slice(-10)}`,
        signature: 'mock_valid_signature',
      });
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
      isLoading={isProcessing}
      loadingText="Processing payment…"
      onClick={handlePay}
    >
      Pay {formatCurrency(booking.priceSnapshot, booking.currency)}
    </Button>
  );
}
