import crypto from 'crypto';

export function createMockProvider() {
  return {
    name: 'mock',
    async createOrder({ amount, currency, receipt }) {
      return {
        id: `mock_order_${crypto.randomUUID()}`,
        amount,
        currency,
        receipt,
      };
    },
    verifyPayment({ orderId, paymentId, signature }) {
      return Boolean(orderId && paymentId && signature === 'mock_valid_signature');
    },
    verifyWebhook() {
      return true;
    },
  };
}
