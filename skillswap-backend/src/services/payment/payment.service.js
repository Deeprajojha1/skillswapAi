import crypto from 'crypto';
import ApiError from '../../utils/ApiError.js';
import Booking from '../../models/Booking.js';
import Payment from '../../models/Payment.js';
import { env } from '../../config/env.js';
import { BOOKING_STATUS, PAYMENT_RECORD_STATUS, PAYMENT_STATUS } from '../../utils/constants.js';
import { queueNotification } from '../notification.service.js';

/**
 * Direct payment: no external payment gateway, no order/verify round trip.
 * The client hits this once and the booking is marked paid immediately.
 */
export async function payBooking({ bookingId }, user) {
  const booking = await Booking.findById(bookingId).populate('gig creator client');
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.client.id !== user.id && user.role !== 'admin') throw new ApiError(403, 'This booking does not belong to you');
  if (booking.status !== BOOKING_STATUS.ACCEPTED) throw new ApiError(400, 'Payment is allowed only after booking acceptance');
  if (booking.paymentStatus === PAYMENT_STATUS.PAID) throw new ApiError(409, 'Booking is already paid');

  const amount = booking.priceSnapshot || booking.amount;
  const currency = booking.currency || env.paymentCurrency;
  const receipt = `booking_${booking.id}`;
  const paymentId = `direct_${crypto.randomUUID()}`;

  let payment = await Payment.findOne({ booking: booking.id });
  if (payment && payment.status === PAYMENT_RECORD_STATUS.PAID) return payment;

  if (payment) {
    payment.provider = 'direct';
    payment.orderId = receipt;
    payment.paymentId = paymentId;
    payment.amount = amount;
    payment.currency = currency;
    payment.status = PAYMENT_RECORD_STATUS.PAID;
    payment.paidAt = new Date();
    payment.failureReason = '';
    await payment.save();
  } else {
    payment = await Payment.create({
      booking: booking.id,
      gig: booking.gig.id,
      client: booking.client.id,
      creator: booking.creator.id,
      provider: 'direct',
      orderId: receipt,
      paymentId,
      amount,
      currency,
      status: PAYMENT_RECORD_STATUS.PAID,
      receipt,
      paidAt: new Date(),
    });
  }

  booking.paymentStatus = PAYMENT_STATUS.PAID;
  booking.payment = payment.id;
  await booking.save();

  try {
    await queueNotification({
      userId: booking.creator.id,
      type: 'payment.success',
      title: 'Payment received',
      message: `Payment completed for ${booking.gig.title}.`,
      bookingId: booking.id,
      gigId: booking.gig.id,
      paymentId: payment.id,
      socketEvent: 'payment:success',
    });
  } catch (error) {
    console.warn('Payment success notification skipped:', error.message);
  }

  try {
    await queueNotification({
      userId: booking.client.id,
      type: 'payment.success',
      title: 'Payment successful',
      message: `Your payment for ${booking.gig.title} was successful.`,
      bookingId: booking.id,
      gigId: booking.gig.id,
      paymentId: payment.id,
      socketEvent: 'payment:success',
    });
  } catch (error) {
    console.warn('Payment success notification skipped:', error.message);
  }

  return payment;
}
