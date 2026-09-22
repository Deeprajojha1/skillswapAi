import ApiError from '../utils/ApiError.js';
import Booking from '../models/Booking.js';
import Gig from '../models/Gig.js';
import { BOOKING_STATUS, GIG_STATUS, PAYMENT_STATUS, USER_ROLES } from '../utils/constants.js';
import { env } from '../config/env.js';
import { assertBookingTransition } from './bookingState.service.js';
import { queueNotification } from './notification.service.js';

export function listBookings(user) {
  const filter = user.role === USER_ROLES.CREATOR ? { creator: user.id } : { client: user.id };
  return Booking.find(filter).populate('gig creator client').sort({ createdAt: -1 });
}

export function listClientBookings(user) {
  return Booking.find({ client: user.id }).populate('gig creator client').sort({ createdAt: -1 });
}

export function listIncomingBookings(user) {
  return Booking.find({ creator: user.id }).populate('gig creator client').sort({ createdAt: -1 });
}

export async function createBooking({ gigId, requirements, deadline }, clientId) {
  const gig = await Gig.findById(gigId);
  if (!gig) throw new ApiError(404, 'Gig not found');
  if (gig.status !== GIG_STATUS.ACTIVE) throw new ApiError(400, 'Currently unavailable');
  if (gig.creator.toString() === clientId) throw new ApiError(400, 'Creators cannot book their own gigs');

  const duplicate = await Booking.findOne({
    gig: gig.id,
    client: clientId,
    status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.ACCEPTED] },
  });
  if (duplicate) throw new ApiError(409, 'You already have an active request for this gig');

  const accepted = await Booking.countDocuments({ gig: gig.id, status: BOOKING_STATUS.ACCEPTED });
  if (accepted) throw new ApiError(400, 'Currently unavailable');

  const booking = await Booking.create({
    gig: gig.id,
    client: clientId,
    creator: gig.creator,
    deadline,
    requirements,
    amount: gig.rate,
    priceSnapshot: gig.rate,
    currency: env.paymentCurrency,
  });

  await queueNotification({
    userId: gig.creator.toString(),
    type: 'booking.created',
    title: 'New booking request',
    message: 'A client requested your gig.',
    bookingId: booking.id,
    gigId: gig.id,
    socketEvent: 'booking:new',
  });

  return booking;
}

export async function getBookingById(id, user) {
  const booking = await Booking.findById(id).populate('gig creator client');
  if (!booking) throw new ApiError(404, 'Booking not found');
  const canView = [booking.client.id, booking.creator.id].includes(user.id) || user.role === 'admin';
  if (!canView) throw new ApiError(403, 'You cannot view this booking');
  return booking;
}

async function assertCreatorCanHandle(id, user) {
  const booking = await Booking.findById(id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.creator.toString() !== user.id && user.role !== 'admin') {
    throw new ApiError(403, 'Only the creator can update booking status');
  }
  if (booking.status !== BOOKING_STATUS.PENDING) throw new ApiError(400, 'Booking is already processed');
  return booking;
}

export async function acceptBooking(id, user) {
  const booking = await assertCreatorCanHandle(id, user);
  assertBookingTransition(booking.status, BOOKING_STATUS.ACCEPTED);
  const activeBooking = await Booking.findOne({ gig: booking.gig, status: BOOKING_STATUS.ACCEPTED });
  if (activeBooking) throw new ApiError(400, 'This gig already has an accepted booking');
  booking.status = BOOKING_STATUS.ACCEPTED;
  booking.acceptedAt = new Date();
  await Gig.findByIdAndUpdate(booking.gig, { status: GIG_STATUS.BOOKED });
  await Booking.updateMany(
    { _id: { $ne: booking.id }, gig: booking.gig, status: BOOKING_STATUS.PENDING },
    { status: BOOKING_STATUS.DECLINED, reason: 'Creator accepted another booking', declineReason: 'Creator accepted another booking', declinedAt: new Date() },
  );
  const saved = await booking.save();
  await queueNotification({
    userId: booking.client.toString(),
    type: 'booking.accepted',
    title: 'Booking accepted',
    message: 'Your booking was accepted. You can pay now.',
    bookingId: booking.id,
    gigId: booking.gig.toString(),
    socketEvent: 'booking:accepted',
  });
  return saved;
}

export async function declineBooking(id, reason, user) {
  const booking = await assertCreatorCanHandle(id, user);
  assertBookingTransition(booking.status, BOOKING_STATUS.DECLINED);
  booking.status = BOOKING_STATUS.DECLINED;
  booking.reason = reason || 'Currently unavailable';
  booking.declineReason = booking.reason;
  booking.declinedAt = new Date();
  const saved = await booking.save();
  await queueNotification({
    userId: booking.client.toString(),
    type: 'booking.declined',
    title: 'Booking declined',
    message: booking.reason,
    bookingId: booking.id,
    gigId: booking.gig.toString(),
    socketEvent: 'booking:declined',
  });
  return saved;
}

export async function cancelBooking(id, reason, user) {
  const booking = await Booking.findById(id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  const isClient = booking.client.toString() === user.id;
  const isCreator = booking.creator.toString() === user.id;
  if (!isClient && !isCreator && user.role !== 'admin') throw new ApiError(403, 'You cannot cancel this booking');
  if (booking.status === BOOKING_STATUS.PENDING && !isClient && user.role !== 'admin') {
    throw new ApiError(403, 'Creators can cancel only accepted bookings');
  }
  assertBookingTransition(booking.status, BOOKING_STATUS.CANCELLED);
  booking.status = BOOKING_STATUS.CANCELLED;
  booking.cancelledBy = user.id;
  booking.cancellationReason = reason || 'Cancelled by user';
  booking.cancelledAt = new Date();
  const saved = await booking.save();
  if (booking.status === BOOKING_STATUS.CANCELLED) await Gig.findByIdAndUpdate(booking.gig, { status: GIG_STATUS.ACTIVE });
  const notifyUser = isClient ? booking.creator : booking.client;
  await queueNotification({
    userId: notifyUser.toString(),
    type: 'booking.cancelled',
    title: 'Booking cancelled',
    message: booking.cancellationReason,
    bookingId: booking.id,
    gigId: booking.gig.toString(),
    socketEvent: 'booking:cancelled',
  });
  return saved;
}

export async function completeBooking(id, user) {
  const booking = await Booking.findById(id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.creator.toString() !== user.id && user.role !== 'admin') throw new ApiError(403, 'Only creator can complete booking');
  assertBookingTransition(booking.status, BOOKING_STATUS.COMPLETED);
  if (booking.paymentStatus !== PAYMENT_STATUS.PAID) throw new ApiError(400, 'Paid booking required before completion');
  booking.status = BOOKING_STATUS.COMPLETED;
  booking.completedAt = new Date();
  const saved = await booking.save();
  await Gig.findByIdAndUpdate(booking.gig, { status: GIG_STATUS.ACTIVE });
  await queueNotification({
    userId: booking.client.toString(),
    type: 'booking.completed',
    title: 'Booking completed',
    message: 'Your booking was marked completed.',
    bookingId: booking.id,
    gigId: booking.gig.toString(),
    socketEvent: 'booking:completed',
  });
  return saved;
}
