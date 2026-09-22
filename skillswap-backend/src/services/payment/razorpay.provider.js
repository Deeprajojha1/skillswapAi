import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../../config/env.js';

export function createRazorpayProvider() {
  const instance = new Razorpay({
    key_id: env.paymentKeyId,
    key_secret: env.paymentKeySecret,
  });

  return {
    name: 'razorpay',
    async createOrder({ amount, currency, receipt, metadata }) {
      return instance.orders.create({
        amount,
        currency,
        receipt,
        notes: metadata,
      });
    },
    verifyPayment({ orderId, paymentId, signature }) {
      const expected = crypto
        .createHmac('sha256', env.paymentKeySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
      return expected === signature;
    },
    verifyWebhook(rawBody, signature) {
      if (!env.paymentWebhookSecret) return false;
      const expected = crypto.createHmac('sha256', env.paymentWebhookSecret).update(rawBody).digest('hex');
      return expected === signature;
    },
  };
}
