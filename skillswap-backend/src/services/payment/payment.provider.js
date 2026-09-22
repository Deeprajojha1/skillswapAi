import { env } from '../../config/env.js';
import { createMockProvider } from './mock.provider.js';
import { createRazorpayProvider } from './razorpay.provider.js';

export function getPaymentProvider() {
  if (env.paymentProvider === 'razorpay') return createRazorpayProvider();
  return createMockProvider();
}
