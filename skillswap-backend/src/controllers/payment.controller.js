import { createPaymentOrder, verifyPayment } from '../services/payment/payment.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/response.js';

export const createOrder = asyncHandler(async (req, res) => {
  const payment = await createPaymentOrder(req.body, req.user);
  sendCreated(res, {
    paymentId: payment.id,
    orderId: payment.orderId,
    amount: payment.amount,
    currency: payment.currency,
    provider: payment.provider,
  }, 'Payment order created');
});

export const verify = asyncHandler(async (req, res) => {
  sendSuccess(res, await verifyPayment(req.body, req.user), 'Payment verified');
});

export const webhook = asyncHandler(async (_req, res) => {
  sendSuccess(res, { received: true }, 'Webhook received');
});
