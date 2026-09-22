import ApiError from '../../utils/ApiError.js';
import Booking from '../../models/Booking.js';
import Payment from '../../models/Payment.js';
import { env } from '../../config/env.js';
import { BOOKING_STATUS, PAYMENT_RECORD_STATUS, PAYMENT_STATUS } from '../../utils/constants.js';
import { queueNotification } from '../notification.service.js';
import { getPaymentProvider } from './payment.provider.js';

export async function createPaymentOrder({ bookingId }, user) {
  const booking = await Booking.findById(bookingId).populate('gig creator client');
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.client.id !== user.id && user.role !== 'admin') throw new ApiError(403, 'This booking does not belong to you');
  if (booking.status !== BOOKING_STATUS.ACCEPTED) throw new ApiError(400, 'Payment is allowed only after booking acceptance');
  if (booking.paymentStatus === PAYMENT_STATUS.PAID) throw new ApiError(409, 'Booking is already paid');

  const existing = await Payment.findOne({ booking: booking.id });
  if (existing) return existing;

  const provider = getPaymentProvider();
  const amount = booking.priceSnapshot || booking.amount;
  const receipt = `booking_${booking.id}`;
  const order = await provider.createOrder({
    amount: Math.round(amount * 100),
    currency: booking.currency || env.paymentCurrency,
    receipt,
    metadata: { bookingId: booking.id },
  });

  const payment = await Payment.create({
    booking: booking.id,
    gig: booking.gig.id,
    client: booking.client.id,
    creator: booking.creator.id,
    provider: provider.name,
    orderId: order.id,
    amount,
    currency: booking.currency || env.paymentCurrency,
    status: PAYMENT_RECORD_STATUS.CREATED,
    receipt,
    metadata: { providerOrder: order },
  });

  booking.paymentStatus = PAYMENT_STATUS.PENDING;
  booking.payment = payment.id;
  await booking.save();

  await queueNotification({
    userId: booking.client.id,
    type: 'payment.created',
    title: 'Payment order created',
    message: `Payment order created for ${booking.gig.title}.`,
    bookingId: booking.id,
    gigId: booking.gig.id,
    paymentId: payment.id,
    socketEvent: 'payment:created',
  });

  return payment;
}

export async function verifyPayment(payload, user) {
  const payment = await Payment.findOne({ orderId: payload.orderId }).populate('booking gig client creator');
  if (!payment) throw new ApiError(404, 'Payment record not found');
  if (payment.client.id !== user.id && user.role !== 'admin') throw new ApiError(403, 'This payment does not belong to you');
  if (payment.status === PAYMENT_RECORD_STATUS.PAID) return payment;

  const provider = getPaymentProvider();
  const valid = provider.verifyPayment({
    orderId: payload.orderId,
    paymentId: payload.paymentId,
    signature: payload.signature,
  });
  if (!valid) {
    payment.status = PAYMENT_RECORD_STATUS.FAILED;
    payment.failureReason = 'Invalid payment signature';
    await payment.save();
    throw new ApiError(400, 'Invalid payment signature');
  }

  payment.status = PAYMENT_RECORD_STATUS.PAID;
  payment.paymentId = payload.paymentId;
  payment.paidAt = new Date();
  await payment.save();

  payment.booking.paymentStatus = PAYMENT_STATUS.PAID;
  payment.booking.payment = payment.id;
  await payment.booking.save();

  await queueNotification({
    userId: payment.creator.id,
    type: 'payment.success',
    title: 'Payment received',
    message: `Payment completed for ${payment.gig.title}.`,
    bookingId: payment.booking.id,
    gigId: payment.gig.id,
    paymentId: payment.id,
    socketEvent: 'payment:success',
  });

  return payment;
}
