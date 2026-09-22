import { payBooking } from '../services/payment/payment.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const pay = asyncHandler(async (req, res) => {
  const payment = await payBooking(req.body, req.user);
  sendSuccess(res, {
    paymentId: payment.id,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    paidAt: payment.paidAt,
  }, 'Payment successful');
});
